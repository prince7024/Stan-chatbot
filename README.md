# STAN Conversational Chatbot 🤖

A human-like conversational chatbot designed to be embedded into consumer-facing or UGC platforms.  
The chatbot demonstrates contextual awareness, long-term memory, emotional tone adaptation, and hallucination-safe behavior.

---

## ✨ Key Features

- Human-like, natural conversation flow
- Emotional tone adaptation (playful, empathetic, neutral)
- Long-term memory across sessions
- Semantic context recall using embeddings
- Identity consistency & hallucination resistance
- Clean, embeddable chat UI

---
## 📸 Screenshot

![STAN Chatbot UI](screenshots/chat-ui.png)

---

## 🧠 Memory Strategy

The chatbot implements a **three-layered memory strategy**:

### 1. Short-Term Memory
- Recent conversation messages are included directly in the prompt.
- Enables smooth conversational flow.

### 2. Long-Term Memory (Persistent)
Stored in **MongoDB Atlas**:
- User identity
- Preferences and interests
- Chat history

This enables memory recall across sessions (page refresh, new visit).

### 3. Semantic Memory (Contextual Recall)
- User messages are converted into embeddings.
- Cosine similarity is used to retrieve relevant past context.
- Enables meaning-based recall rather than keyword matching.

> **Note:** For this demo, semantic memory is maintained in-memory.  
> In production, this can be replaced with a persistent vector database such as Pinecone, FAISS, or ChromaDB Vector.

---



## 🏗 Architecture

```text
User
  ↓
Frontend (React + Tailwind CSS)
  ↓
Backend API (Node.js + Express)
  ↓
Memory Layer
   ├─ MongoDB Atlas (Persistent Memory)
   └─ Semantic Context Retrieval
       (Embeddings + Similarity Search)
  ↓
Gemini LLM
  ↓
AI Response → Frontend UI

```
---

## 🛠 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### AI & APIs
- Google Gemini 2.5 Flash (response generation)
- Gemini text-embedding-004 (semantic embeddings)

### Database
- MongoDB Atlas (persistent memory)
- In-memory vector similarity store (semantic recall)

---

## 🔐 Safety & Hallucination Control

- The chatbot never invents memories or real-world interactions.
- When uncertain, it responds safely or asks clarifying questions.
- Maintains identity consistency even under probing questions.

---
## 🚀 Getting Started (Local Setup)

Follow these steps to run the project locally.

### ✅ Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm 
- MongoDB Atlas (or local MongoDB)
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/prince7024/Stan-chatbot.git
cd stan-chatbot

```

### 2️⃣ Backend Setup

Create a .env file inside the backend directory:
```bash
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
```
Navigate to the backend directory,install dependencies and Start  server:
```bash
cd backend
npm install
npm run dev

```
### 3️⃣ Frontend Setup

Open a new terminal window and run: 
```bash
cd frontend
npm install
npm run dev

```
