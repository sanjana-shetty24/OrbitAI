"""
╔══════════════════════════════════════════════════════════════╗
║        AI CHATBOT BACKEND - FastAPI + Gemini 2.5 Flash      ║
╚══════════════════════════════════════════════════════════════╝
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
import os

from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def chatbot(message: str) -> str:
    response = model.generate_content(message)
    return response.text


app = FastAPI(
    title="Aether AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database
chats_db = {}


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str


class NewChatRequest(BaseModel):
    title: Optional[str] = "New Chat"


class SendMessageRequest(BaseModel):
    chat_id: str
    message: str


class RenameChatRequest(BaseModel):
    title: str


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "AI Chatbot API is running"
    }


@app.post("/new-chat")
def new_chat(body: NewChatRequest):
    chat_id = str(uuid.uuid4())

    chats_db[chat_id] = {
        "id": chat_id,
        "title": body.title,
        "messages": [],
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }

    return chats_db[chat_id]


@app.post("/chat")
def send_message(body: SendMessageRequest):
    if body.chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat = chats_db[body.chat_id]

    user_msg = {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": body.message,
        "timestamp": now_iso(),
    }

    chat["messages"].append(user_msg)

    try:
        ai_text = chatbot(body.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if len(chat["messages"]) == 1:
        chat["title"] = body.message[:40] + ("..." if len(body.message) > 40 else "")

    ai_msg = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": ai_text,
        "timestamp": now_iso(),
    }

    chat["messages"].append(ai_msg)
    chat["updated_at"] = now_iso()

    return {
        "chat": chat,
        "message": ai_msg
    }


@app.get("/history")
def get_history():
    summaries = []

    for chat in chats_db.values():
        summaries.append({
            "id": chat["id"],
            "title": chat["title"],
            "created_at": chat["created_at"],
            "updated_at": chat["updated_at"],
            "message_count": len(chat["messages"]),
            "preview": chat["messages"][-1]["content"][:80] if chat["messages"] else "",
        })

    summaries.sort(key=lambda x: x["updated_at"], reverse=True)

    return summaries


@app.get("/chat/{chat_id}")
def get_chat(chat_id: str):
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chats_db[chat_id]


@app.delete("/chat/{chat_id}")
def delete_chat(chat_id: str):
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")

    del chats_db[chat_id]

    return {
        "success": True,
        "deleted_id": chat_id
    }


@app.patch("/chat/{chat_id}/rename")
def rename_chat(chat_id: str, body: RenameChatRequest):
    if chat_id not in chats_db:
        raise HTTPException(status_code=404, detail="Chat not found")

    chats_db[chat_id]["title"] = body.title
    chats_db[chat_id]["updated_at"] = now_iso()

    return chats_db[chat_id]


@app.delete("/chats/all")
def clear_all_chats():
    chats_db.clear()

    return {
        "success": True
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api.index:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )