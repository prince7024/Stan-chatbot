# STAN Conversational Chatbot Assignment 🤖

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

 User → Frontend (React + Tailwind) → Backend API (Node.js + Express)
→ MongoDB (Persistent Memory) → Semantic Context Retrieval → Gemini LLM (Response Generation)




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

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```
### 2️⃣  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
