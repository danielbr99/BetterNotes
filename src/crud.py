from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from . import models, schemas

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

# Note CRUD (Filtered by user_id)
async def create_note(db: AsyncSession, note: schemas.NoteCreate, user_id: int):
    db_note = models.Note(titulo=note.titulo, contenido=note.contenido, user_id=user_id)
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note

async def get_note(db: AsyncSession, note_id: int, user_id: int):
    result = await db.execute(
        select(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def get_notes(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Note).filter(models.Note.user_id == user_id).offset(skip).limit(limit)
    )
    return result.scalars().all()
