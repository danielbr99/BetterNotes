from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional, List, Union

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Folder Schemas
class FolderBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    is_encrypted: bool = False
    encryption_metadata: Optional[str] = None

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int

# Entry Schemas (Polymorphic)
class EntryBase(BaseModel):
    titulo: str = Field(..., min_length=1, description="El título de la entrada")
    contenido: str = Field(..., description="El contenido (texto enriquecido o blob cifrado)")
    type: str = Field(..., description="'note' o 'task'")
    is_encrypted: bool = False
    encryption_metadata: Optional[str] = None
    tags: List[str] = []
    folder_id: Optional[int] = None

class EntryCreate(EntryBase):
    # Kanban fields for Tasks
    priority: Optional[str] = None
    status_column: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: bool = False

class EntryUpdate(BaseModel):
    titulo: Optional[str] = None
    contenido: Optional[str] = None
    is_encrypted: Optional[bool] = None
    encryption_metadata: Optional[str] = None
    tags: Optional[List[str]] = None
    folder_id: Optional[int] = None
    priority: Optional[str] = None
    status_column: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None

class Entry(EntryBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    fecha_creacion: datetime
    fecha_modificacion: datetime
    version: int
    user_id: int
    
    # Task specific fields
    priority: Optional[str] = None
    status_column: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None

class EntryResponse(BaseModel):
    message: str

# Asset Schemas
class Asset(BaseModel):
    id: str
    filename: str
    content_type: str
    size: int
    entry_id: Optional[int] = None

# Kanban Column Schemas
class KanbanColumnBase(BaseModel):
    name: str
    position: Optional[int] = 0

class KanbanColumnCreate(KanbanColumnBase):
    pass

class KanbanColumn(KanbanColumnBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
