from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


class ChatCreateResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True


class ChatDetailResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut]

    class Config:
        from_attributes = True


class ChatHistoryItem(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int
    preview: str

    class Config:
        from_attributes = True


class ChatMessageRequest(BaseModel):
    chat_id: str
    message: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    chat_id: str
    reply: str
    messages: List[MessageOut]

    class Config:
        from_attributes = True


class RenameRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class RenameResponse(BaseModel):
    id: str
    title: str
    updated_at: datetime

    class Config:
        from_attributes = True


class DeleteResponse(BaseModel):
    detail: str


class ClearAllResponse(BaseModel):
    detail: str
    deleted_chats: int
