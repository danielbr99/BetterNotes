from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from . import models, schemas
from typing import Optional

# User CRUD
async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Entry CRUD (Polymorphic)
async def create_entry(db: AsyncSession, entry: schemas.EntryCreate, user_id: int):
    entry_data = entry.model_dump()
    
    # Cascading Encryption Logic
    if entry.folder_id:
        result = await db.execute(select(models.Folder).filter(models.Folder.id == entry.folder_id))
        folder = result.scalar_one_or_none()
        if folder and folder.is_encrypted:
            entry_data["is_encrypted"] = True
            # Inherit metadata only if entry didn't provide its own
            if not entry_data.get("encryption_metadata"):
                entry_data["encryption_metadata"] = folder.encryption_metadata

    tags = entry_data.pop("tags", [])
    entry_data["tags_raw"] = ",".join(tags) if tags else None
    
    # Determine the model based on type
    if entry.type == "task":
        db_entry = models.Task(
            **entry_data,
            user_id=user_id
        )
    else:
        # Exclude task-specific fields for notes
        for field in ["priority", "status_column", "due_date"]:
            entry_data.pop(field, None)
        db_entry = models.Note(
            **entry_data,
            user_id=user_id
        )
    
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry

async def get_entry(db: AsyncSession, entry_id: int, user_id: int):
    result = await db.execute(
        select(models.Entry).filter(models.Entry.id == entry_id, models.Entry.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def get_entries(
    db: AsyncSession, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    type: Optional[str] = None,
    status_column: Optional[str] = None,
    priority: Optional[str] = None,
    is_encrypted: Optional[bool] = None,
    folder_id: Optional[int] = None,
    q: Optional[str] = None,
    sort_by: str = "fecha_creacion",
    order: str = "desc"
):
    query = select(models.Entry).filter(models.Entry.user_id == user_id)
    
    # Filtering
    if type:
        query = query.filter(models.Entry.type == type)
    if status_column:
        query = query.filter(models.Entry.status_column == status_column)
    if priority:
        query = query.filter(models.Entry.priority == priority)
    if is_encrypted is not None:
        query = query.filter(models.Entry.is_encrypted == is_encrypted)
    if folder_id:
        query = query.filter(models.Entry.folder_id == folder_id)
    
    # Keyword Search (unencrypted only)
    if q:
        search = f"%{q}%"
        query = query.filter(
            (models.Entry.titulo.ilike(search)) | 
            ((models.Entry.contenido.ilike(search)) & (models.Entry.is_encrypted == False))
        )
        
    # Sorting
    sort_attr = getattr(models.Entry, sort_by, models.Entry.fecha_creacion)
    if order == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())
        
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

async def update_entry(db: AsyncSession, db_entry: models.Entry, entry_update: schemas.EntryUpdate):
    update_data = entry_update.model_dump(exclude_unset=True)
    
    if "tags" in update_data:
        tags = update_data.pop("tags")
        update_data["tags_raw"] = ",".join(tags) if tags else None
        
    for key, value in update_data.items():
        setattr(db_entry, key, value)
        
    db_entry.version += 1
    await db.commit()
    await db.refresh(db_entry)
    return db_entry

async def delete_entry(db: AsyncSession, db_entry: models.Entry):
    await db.delete(db_entry)
    await db.commit()

# Asset CRUD
async def create_asset(db: AsyncSession, asset_data: dict, user_id: int):
    db_asset = models.Asset(**asset_data, user_id=user_id)
    db.add(db_asset)
    await db.commit()
    await db.refresh(db_asset)
    return db_asset

async def get_asset(db: AsyncSession, asset_id: str, user_id: int):
    result = await db.execute(
        select(models.Asset).filter(models.Asset.id == asset_id, models.Asset.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def delete_asset(db: AsyncSession, db_asset: models.Asset):
    await db.delete(db_asset)
    await db.commit()

# Kanban Column CRUD
async def get_columns(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.KanbanColumn).filter(models.KanbanColumn.user_id == user_id).order_by(models.KanbanColumn.position)
    )
    return result.scalars().all()

async def create_column(db: AsyncSession, column: schemas.KanbanColumnCreate, user_id: int):
    db_column = models.KanbanColumn(**column.model_dump(), user_id=user_id)
    db.add(db_column)
    await db.commit()
    await db.refresh(db_column)
    return db_column

async def get_column(db: AsyncSession, column_id: int, user_id: int):
    result = await db.execute(
        select(models.KanbanColumn).filter(models.KanbanColumn.id == column_id, models.KanbanColumn.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def delete_column(db: AsyncSession, db_column: models.KanbanColumn):
    await db.delete(db_column)
    await db.commit()

# Folder CRUD
async def get_folders(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.Folder).filter(models.Folder.user_id == user_id)
    )
    return result.scalars().all()

async def create_folder(db: AsyncSession, folder: schemas.FolderCreate, user_id: int):
    db_folder = models.Folder(**folder.model_dump(), user_id=user_id)
    db.add(db_folder)
    await db.commit()
    await db.refresh(db_folder)
    return db_folder

async def get_folder(db: AsyncSession, folder_id: int, user_id: int):
    result = await db.execute(
        select(models.Folder).filter(models.Folder.id == folder_id, models.Folder.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def delete_folder(db: AsyncSession, db_folder: models.Folder):
    await db.delete(db_folder)
    await db.commit()
