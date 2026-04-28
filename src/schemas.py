from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional

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

# Note Schemas
class NoteBase(BaseModel):
    titulo: str = Field(..., min_length=1, description="El título de la nota")
    contenido: str = Field(..., description="El contenido de la nota")

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    fecha_creacion: datetime
    user_id: int

class NoteResponse(BaseModel):
    message: str
