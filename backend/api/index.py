import os
import sys
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Allow imports from the backend/ root (database.py, models.py, schemas.py, crud.py)
# when this module is executed as api/index.py (e.g. on Vercel).
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import crud
import models
import schemas
from database import Base, SessionLocal, engine

from google import genai

# ─────────────────────────────────────────────────────────────
# Gemini Setup (New google-genai SDK)
# ─────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

client = genai.Client(api_key=GEMINI_API_KEY)


def chatbot(message: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=message,
    )

    return response.text


# ─────────────────────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────────────────────

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aether AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _serialize_messages(messages: List[models.Message]) -> List[dict]:
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "timestamp": m.timestamp,
        }
        for m in messages
    ]


def _make_preview(content: str, limit: int = 100) -> str:
    content = content or ""
    return content[:limit] + ("..." if len(content) > limit else "")


# ─────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Aether AI Backend",
        "storage": "PostgreSQL",
    }


@app.post("/new-chat", response_model=schemas.ChatCreateResponse)
def new_chat(db: Session = Depends(get_db)):
    chat = crud.create_chat(db, title="New Chat")

    return {
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
        "messages": [],
    }


@app.post("/chat", response_model=schemas.ChatMessageResponse)
def send_message(payload: schemas.ChatMessageRequest, db: Session = Depends(get_db)):
    chat = crud.get_chat(db, payload.chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    is_first_message = crud.get_message_count(db, chat.id) == 0

    # Save user message
    crud.add_message(db, chat.id, role="user", content=payload.message)

    # Auto-title first message
    if is_first_message:
        title = payload.message.strip()

        if len(title) > 50:
            title = title[:50].rstrip() + "..."

        crud.update_chat_title(db, chat, title or "New Chat")

    # Gemini response
    try:
        reply_text = chatbot(payload.message)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini request failed: {str(exc)}",
        ) from exc

    # Save assistant response
    crud.add_message(
        db,
        chat.id,
        role="assistant",
        content=reply_text,
    )

    crud.touch_chat(db, chat)

    messages = crud.get_messages_ordered(db, chat.id)

    return {
        "chat_id": chat.id,
        "reply": reply_text,
        "messages": _serialize_messages(messages),
    }


@app.get("/history", response_model=List[schemas.ChatHistoryItem])
def history(db: Session = Depends(get_db)):
    chats = crud.get_all_chats(db)

    result = []

    for chat in chats:
        messages = crud.get_messages_ordered(db, chat.id)

        preview = _make_preview(messages[-1].content) if messages else ""

        result.append(
            {
                "id": chat.id,
                "title": chat.title,
                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
                "message_count": len(messages),
                "preview": preview,
            }
        )

    return result


@app.get("/chat/{chat_id}", response_model=schemas.ChatDetailResponse)
def get_chat_detail(chat_id: str, db: Session = Depends(get_db)):
    chat = crud.get_chat(db, chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = crud.get_messages_ordered(db, chat_id)

    return {
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
        "messages": _serialize_messages(messages),
    }


@app.patch("/chat/{chat_id}/rename", response_model=schemas.RenameResponse)
def rename_chat_endpoint(
    chat_id: str,
    payload: schemas.RenameRequest,
    db: Session = Depends(get_db),
):
    chat = crud.rename_chat(db, chat_id, payload.title)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return {
        "id": chat.id,
        "title": chat.title,
        "updated_at": chat.updated_at,
    }


@app.delete("/chat/{chat_id}", response_model=schemas.DeleteResponse)
def delete_chat_endpoint(chat_id: str, db: Session = Depends(get_db)):
    deleted = crud.delete_chat(db, chat_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Chat not found")

    return {
        "detail": "Chat deleted successfully",
    }


@app.delete("/chats/all", response_model=schemas.ClearAllResponse)
def delete_all_chats_endpoint(db: Session = Depends(get_db)):
    count = crud.delete_all_chats(db)

    return {
        "detail": "All chats deleted successfully",
        "deleted_chats": count,
    }