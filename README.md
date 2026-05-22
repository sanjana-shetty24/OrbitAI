# Aether AI — Full-Stack Chatbot App

A production-quality AI chat application powered by **Gemini 2.5 Flash**, built with React + Vite + FastAPI.

---

## Project Structure

```
chatapp/
├── backend/
│   ├── main.py              ← FastAPI server + your Gemini chatbot
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   └── ChatPage.jsx
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.jsx
        │   │   └── Navbar.jsx
        │   ├── chat/
        │   │   ├── ChatArea.jsx
        │   │   ├── ChatInput.jsx
        │   │   ├── Message.jsx
        │   │   ├── TypingIndicator.jsx
        │   │   └── WelcomeScreen.jsx
        │   └── ui/
        │       └── SettingsModal.jsx
        ├── store/
        │   ├── authStore.js
        │   ├── chatStore.js
        │   └── themeStore.js
        ├── utils/
        │   ├── api.js
        │   └── export.js
        └── styles/
            └── globals.css
```

---

## Quick Start

### 1. Backend (FastAPI + Gemini)

```bash
cd chatapp/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

Backend runs at → **http://localhost:8000**
API docs at → **http://localhost:8000/docs**

---

### 2. Frontend (React + Vite)

```bash
cd chatapp/frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at → **http://localhost:5173**

---

## Chatbot Integration

Your Gemini code is already wired into `backend/main.py`:

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
_model = genai.GenerativeModel("gemini-2.5-flash")

def chatbot(message: str) -> str:
    response = _model.generate_content(message)
    return response.text
```

The `chatbot()` function is called on every `/chat` POST request automatically.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/new-chat` | Create a new chat session |
| POST | `/chat` | Send a message, get AI response |
| GET | `/history` | List all chat sessions |
| GET | `/chat/{id}` | Get full chat with messages |
| DELETE | `/chat/{id}` | Delete a chat |
| PATCH | `/chat/{id}/rename` | Rename a chat |
| DELETE | `/chats/all` | Clear all chats |

---

## Features

- ✅ Gemini 2.5 Flash integration
- ✅ Login / Signup pages (glassmorphism design)
- ✅ Chat with full message history
- ✅ Markdown + code block rendering with syntax highlighting
- ✅ Typing indicator ("Gemini is thinking…")
- ✅ Dark / Light mode with persistence
- ✅ Sidebar with rename, delete, search
- ✅ Copy message, regenerate response, like/dislike
- ✅ Export chat as TXT / JSON / PDF
- ✅ Welcome screen with suggested prompts
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Framer Motion animations throughout

---

## Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve with uvicorn (mount static files)
cd ../backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

Or deploy frontend to Vercel/Netlify and backend to Railway/Render.

---

## Environment Variables (optional hardening)

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

Then in `main.py`:
```python
import os
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
```
