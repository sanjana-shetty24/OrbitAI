from datetime import datetime
from typing import List, Optional

from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload

import models


def create_chat(db: Session, title: str = "New Chat") -> models.Chat:
    chat = models.Chat(title=title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat(db: Session, chat_id: str) -> Optional[models.Chat]:
    return (
        db.query(models.Chat)
        .options(joinedload(models.Chat.messages))
        .filter(models.Chat.id == chat_id)
        .first()
    )


def get_all_chats(db: Session) -> List[models.Chat]:
    return db.query(models.Chat).order_by(desc(models.Chat.updated_at)).all()


def add_message(db: Session, chat_id: str, role: str, content: str) -> models.Message:
    message = models.Message(chat_id=chat_id, role=role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_messages_ordered(db: Session, chat_id: str) -> List[models.Message]:
    return (
        db.query(models.Message)
        .filter(models.Message.chat_id == chat_id)
        .order_by(models.Message.timestamp.asc())
        .all()
    )


def get_message_count(db: Session, chat_id: str) -> int:
    return db.query(models.Message).filter(models.Message.chat_id == chat_id).count()


def update_chat_title(db: Session, chat: models.Chat, title: str) -> models.Chat:
    chat.title = title
    chat.updated_at = datetime.utcnow()
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def touch_chat(db: Session, chat: models.Chat) -> models.Chat:
    chat.updated_at = datetime.utcnow()
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def rename_chat(db: Session, chat_id: str, title: str) -> Optional[models.Chat]:
    chat = get_chat(db, chat_id)
    if not chat:
        return None
    chat.title = title
    chat.updated_at = datetime.utcnow()
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def delete_chat(db: Session, chat_id: str) -> bool:
    chat = get_chat(db, chat_id)
    if not chat:
        return False
    db.delete(chat)
    db.commit()
    return True


def delete_all_chats(db: Session) -> int:
    count = db.query(models.Chat).count()
    db.query(models.Message).delete()
    db.query(models.Chat).delete()
    db.commit()
    return count
