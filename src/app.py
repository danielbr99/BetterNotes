from datetime import timedelta
from fastapi import FastAPI, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from .database import engine, Base, get_db
from . import crud, schemas, auth

app = FastAPI(title="Pro Notes API", version="1.0.0")

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

# --- Notas ---

@app.get("/notas", response_model=list[schemas.Note])
async def list_notes(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    notes = await crud.get_notes(db, user_id=current_user.id, skip=skip, limit=limit)
    return notes

@app.post("/notas", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note: schemas.NoteCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    await crud.create_note(db=db, note=note, user_id=current_user.id)
    return {"message": "Nota creada con éxito."}

@app.get("/notas/{id}", response_model=schemas.Note)
async def get_note(
    id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_note = await crud.get_note(db, note_id=id, user_id=current_user.id)
    if db_note is None:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"codigo": "NOT_FOUND", "mensaje": "El recurso solicitado no pudo ser localizado."},
        )
    return db_note
