import os
import shutil
from datetime import timedelta
from typing import Optional
import uuid

from fastapi import FastAPI, Request, status, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware

from src.database import engine, Base, get_db
from src import crud, schemas, auth

app = FastAPI(title="Pro Notes API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En desarrollo es seguro usar "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ASSETS_DIR = "assets"
if not os.path.exists(ASSETS_DIR):
    os.makedirs(ASSETS_DIR)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"codigo": "INVALID_INPUT", "mensaje": str(exc.errors())},
    )

# --- Autenticación ---

@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    hashed_password = auth.get_password_hash(user.password)
    await crud.create_user(db, user=user, hashed_password=hashed_password)
    return {"message": "Usuario registrado con éxito"}

@app.post("/auth/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    user = await crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Entries (Notes & Tasks) ---

@app.get("/entries", response_model=list[schemas.Entry])
async def list_entries(
    skip: int = 0, 
    limit: int = 100,
    type: Optional[str] = None,
    status_column: Optional[str] = None,
    priority: Optional[str] = None,
    is_completed: Optional[bool] = None,
    is_encrypted: Optional[bool] = None,
    folder_id: Optional[int] = None,
    is_deleted: Optional[bool] = False,
    q: Optional[str] = None,
    sort_by: str = "fecha_creacion",
    order: str = "desc",
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    entries = await crud.get_entries(
        db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        type=type,
        status_column=status_column,
        priority=priority,
        is_completed=is_completed,
        is_encrypted=is_encrypted,
        folder_id=folder_id,
        is_deleted=is_deleted,
        q=q,
        sort_by=sort_by,
        order=order
    )
    return entries

@app.get("/entries/trash", response_model=list[schemas.Entry])
async def list_trash(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    entries = await crud.get_entries(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        is_deleted=True
    )
    return entries

@app.post("/entries/{id}/trash", response_model=schemas.Entry)
async def trash_entry(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_entry = await crud.get_entry(db, entry_id=id, user_id=current_user.id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    update_data = schemas.EntryUpdate(is_deleted=True)
    return await crud.update_entry(db, db_entry=db_entry, entry_update=update_data)

@app.post("/entries/{id}/restore", response_model=schemas.Entry)
async def restore_entry(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_entry = await crud.get_entry(db, entry_id=id, user_id=current_user.id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    update_data = schemas.EntryUpdate(is_deleted=False)
    return await crud.update_entry(db, db_entry=db_entry, entry_update=update_data)

@app.post("/entries", response_model=schemas.Entry, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry: schemas.EntryCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return await crud.create_entry(db=db, entry=entry, user_id=current_user.id)

@app.get("/entries/{id}", response_model=schemas.Entry)
async def get_entry(
    id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_entry = await crud.get_entry(db, entry_id=id, user_id=current_user.id)
    if db_entry is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"codigo": "NOT_FOUND", "mensaje": "El recurso solicitado no pudo ser localizado."},
        )
    return db_entry

@app.patch("/entries/{id}", response_model=schemas.Entry)
async def update_entry(
    id: int,
    entry_update: schemas.EntryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_entry = await crud.get_entry(db, entry_id=id, user_id=current_user.id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Validation: Only tasks can have Kanban metadata
    if db_entry.type == "note":
        kanban_fields = ["priority", "status_column", "due_date", "is_completed"]
        if any(getattr(entry_update, field) is not None for field in kanban_fields):
            raise HTTPException(status_code=400, detail="Notes cannot have Kanban metadata")

    return await crud.update_entry(db, db_entry=db_entry, entry_update=entry_update)

@app.delete("/entries/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_entry = await crud.get_entry(db, entry_id=id, user_id=current_user.id)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if not db_entry.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Solo se pueden eliminar permanentemente elementos de la papelera."
        )
        
    await crud.delete_entry(db, db_entry=db_entry)
    return None

# --- Assets ---

@app.post("/assets", response_model=schemas.Asset, status_code=status.HTTP_201_CREATED)
async def upload_asset(
    file: UploadFile = File(...),
    entry_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    asset_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1]
    storage_filename = f"{asset_id}{extension}"
    file_path = os.path.join(ASSETS_DIR, storage_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size = os.path.getsize(file_path)
    
    asset_data = {
        "id": asset_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file_size,
        "entry_id": entry_id
    }
    
    db_asset = await crud.create_asset(db, asset_data=asset_data, user_id=current_user.id)
    return db_asset

@app.get("/assets/{asset_id}", response_class=FileResponse)
async def get_asset(
    asset_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_asset = await crud.get_asset(db, asset_id=asset_id, user_id=current_user.id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    # Search for file with asset_id
    for f in os.listdir(ASSETS_DIR):
        if f.startswith(asset_id):
            return FileResponse(os.path.join(ASSETS_DIR, f))

    raise HTTPException(status_code=404, detail="File not found on disk")

@app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_asset = await crud.get_asset(db, asset_id=asset_id, user_id=current_user.id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    # Delete from disk
    for f in os.listdir(ASSETS_DIR):
        if f.startswith(asset_id):
            os.remove(os.path.join(ASSETS_DIR, f))
            break
            
    # Delete from DB
    await crud.delete_asset(db, db_asset=db_asset)
    return None

# --- Kanban Columns ---

@app.get("/columns", response_model=list[schemas.KanbanColumn])
async def list_columns(
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return await crud.get_columns(db, user_id=current_user.id)

@app.post("/columns", response_model=schemas.KanbanColumn, status_code=status.HTTP_201_CREATED)
async def create_column(
    column: schemas.KanbanColumnCreate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return await crud.create_column(db, column=column, user_id=current_user.id)

@app.delete("/columns/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_column(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_column = await crud.get_column(db, column_id=id, user_id=current_user.id)
    if not db_column:
        raise HTTPException(status_code=404, detail="Column not found")
    await crud.delete_column(db, db_column=db_column)
    return None

# --- Folders ---

@app.get("/folders", response_model=list[schemas.Folder])
async def list_folders(
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return await crud.get_folders(db, user_id=current_user.id)

@app.post("/folders", response_model=schemas.Folder, status_code=status.HTTP_201_CREATED)
async def create_folder(
    folder: schemas.FolderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return await crud.create_folder(db, folder=folder, user_id=current_user.id)

@app.delete("/folders/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_folder(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_folder = await crud.get_folder(db, folder_id=id, user_id=current_user.id)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    await crud.delete_folder(db, db_folder=db_folder)
    return None
