# Aether AI

Aether AI is a full-stack AI chatbot application built using **React**, **FastAPI**, **PostgreSQL (Supabase)**, and **Google Gemini 2.5 Flash**. The application provides a modern conversational interface with persistent chat history, multiple chat sessions, and a responsive user experience.

---

## Features

- Google Gemini 2.5 Flash integration
- Persistent chat history using PostgreSQL
- Multiple chat sessions
- Automatic conversation titles
- Rename and delete conversations
- Delete all conversations
- Responsive user interface
- Dark and light theme support
- FastAPI REST API
- SQLAlchemy ORM
- React with Zustand state management
- Tailwind CSS styling

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Hot Toast

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL (Supabase)
- Google Gen AI SDK (`google-genai`)
- Uvicorn

---

## Project Structure

```text
chatapp/
│
├── backend/
│   ├── api/
│   │   └── index.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── create_tables.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/<your-username>/chatapp.git

cd chatapp
```

---

## Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate the virtual environment.

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

Install the required dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
```

Start the backend server.

```bash
uvicorn api.index:app --reload
```

The backend will be available at:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
```

Example:

```env
GEMINI_API_KEY=AIza...

DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health check |
| POST | `/new-chat` | Create a new chat session |
| POST | `/chat` | Send a message and receive an AI response |
| GET | `/history` | Retrieve chat history |
| GET | `/chat/{chat_id}` | Retrieve a specific conversation |
| PATCH | `/chat/{chat_id}/rename` | Rename a conversation |
| DELETE | `/chat/{chat_id}` | Delete a conversation |
| DELETE | `/chats/all` | Delete all conversations |

---

## Database

The application uses PostgreSQL hosted on Supabase.

### Chats Table

- id
- title
- created_at
- updated_at

### Messages Table

- id
- chat_id
- role
- content
- timestamp

---

## Gemini Integration

The backend uses the latest Google Gen AI SDK.

```python
from google import genai

client = genai.Client(api_key=GEMINI_API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=message,
)
```

---

## Deployment

The frontend can be deployed on platforms such as **Vercel** or **Netlify**.

The backend can be deployed on **Vercel**, **Render**, **Railway**, or any platform that supports FastAPI applications.

---

## Future Enhancements

- User authentication
- Streaming AI responses
- Image upload support
- Voice interaction
- Chat search
- Conversation export
- Shared conversation links

---

## License

This project is licensed under the MIT License.

---

## Author

**Sanjana V Shetty**

GitHub: https://github.com/<your-github-username>

LinkedIn: https://www.linkedin.com/in/<your-linkedin-profile>

