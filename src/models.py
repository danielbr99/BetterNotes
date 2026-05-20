from datetime import datetime, UTC
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey, Boolean, event
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
import os
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    entries: Mapped[List["Entry"]] = relationship("Entry", back_populates="owner")
    assets: Mapped[List["Asset"]] = relationship("Asset", back_populates="owner")
    columns: Mapped[List["KanbanColumn"]] = relationship("KanbanColumn", back_populates="owner")
    folders: Mapped[List["Folder"]] = relationship("Folder", back_populates="owner")

class Entry(Base):
    __tablename__ = "entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    fecha_modificacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    version: Mapped[int] = mapped_column(Integer, default=1)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    
    # Polymorphism and extra fields
    type: Mapped[str] = mapped_column(String(50)) # 'note' or 'task'
    is_encrypted: Mapped[bool] = mapped_column(Boolean, default=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    encryption_metadata: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    folder_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("folders.id"), nullable=True)
    tags_raw: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Comma-separated tags
    
    # Kanban fields (Task-specific, in the same table)
    priority: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    status_column: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_completed: Mapped[Optional[bool]] = mapped_column(Boolean, default=False, nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="entries")
    assets: Mapped[List["Asset"]] = relationship("Asset", back_populates="entry", cascade="all, delete-orphan")
    folder: Mapped[Optional["Folder"]] = relationship("Folder", back_populates="entries")

    @property
    def tags(self) -> List[str]:
        if not self.tags_raw:
            return []
        return self.tags_raw.split(",")

    __mapper_args__ = {
        "polymorphic_on": type,
        "polymorphic_identity": "entry",
    }

class Note(Entry):
    __mapper_args__ = {
        "polymorphic_identity": "note",
    }

class Task(Entry):
    __mapper_args__ = {
        "polymorphic_identity": "task",
    }

class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True) # UUID
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha_subida: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    entry_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("entries.id"), nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="assets")
    entry: Mapped[Optional["Entry"]] = relationship("Entry", back_populates="assets")

@event.listens_for(Asset, "after_delete")
def asset_after_delete(mapper, connection, target):
    """Automatically delete the physical file from disk when an Asset record is deleted."""
    assets_dir = "assets"
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.startswith(target.id):
                try:
                    os.remove(os.path.join(assets_dir, f))
                except OSError:
                    pass
                break

class KanbanColumn(Base):
    __tablename__ = "kanban_columns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    owner: Mapped["User"] = relationship("User", back_populates="columns")

class Folder(Base):
    __tablename__ = "folders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("folders.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    is_encrypted: Mapped[bool] = mapped_column(Boolean, default=False)
    encryption_metadata: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="folders")
    entries: Mapped[List["Entry"]] = relationship("Entry", back_populates="folder", cascade="all, delete-orphan")
    subfolders: Mapped[List["Folder"]] = relationship("Folder", backref="parent", remote_side=[id], cascade="all, delete-orphan")
