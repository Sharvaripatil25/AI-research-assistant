# AI Research Assistant

AI Research Assistant is a full-stack web application designed for researchers who work with large collections of academic papers. Users can upload PDF documents, extract structured insights, ask questions across the uploaded corpus, compare papers, and generate literature reviews with AI-powered citations.

## What the application does

A researcher can upload multiple research papers in PDF format and use the platform to:

- Summarize each paper
- Answer questions across all uploaded papers using retrieval-augmented generation (RAG)
- Compare two or more papers
- Extract key research information such as datasets, methodology, results, and limitations
- Find similar papers
- Generate literature reviews
- Provide citations for every answer
- Save chats and summaries for later review

## Core product features

### Phase 1 — Authentication
- User login
- User signup
- Personal dashboard

### Phase 2 — Upload Papers
- Drag-and-drop PDF uploads
- Store paper metadata including:
  - Title
  - Authors
  - Year
  - Journal
  - Abstract
  - PDF file

### Phase 3 — Document Processing
When a paper is uploaded, the system processes it through the following pipeline:

PDF -> Extract text -> Split into chunks -> Generate embeddings -> Store embeddings -> Ready for search

### Phase 4 — RAG Chat
Users can ask questions such as:

> What datasets were used in these papers?

The system retrieves relevant chunks, sends them to an LLM, and returns an answer with citations.

### Phase 5 — Compare Papers
Users can select multiple papers and receive an AI-generated comparison summary covering:
- Dataset
- Model
- Accuracy
- Limitations
- Key findings

### Phase 6 — Literature Review
Users can request a literature review such as:

> Write a literature review on Transformer-based object detection.

The AI will review all selected papers, group related ideas, highlight differences, and cite the relevant sources.

### Phase 7 — Smart Search
Users can search for concepts such as:

> Reinforcement learning

The system returns matching papers, relevant sections, and similarity scores.

### Phase 8 — Paper Dashboard
Each paper card can display:
- Title
- Authors
- Upload date
- Number of chats
- Summary
- Keywords

### Phase 9 — Citation Support
Every AI-generated answer includes references such as:

> According to Paper A (Section 4.2)...

> Paper B reports 94.2% accuracy...

### Phase 10 — AI Insights
The system can automatically extract:
- Research problem
- Proposed method
- Dataset
- Metrics
- Strengths
- Weaknesses
- Future work

## Tech stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- shadcn/ui
- PDF viewer

### Backend
- Node.js
- Express
- TypeScript

### Database
- PostgreSQL

### Vector Database
- pgvector (inside PostgreSQL)

### AI
- Gemini API or OpenAI
- Embedding model
- LangChain (optional)

### Storage
- Supabase Storage or Cloudinary

### Authentication
- Clerk or Supabase Auth

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Neon

## Recommended project structure

```text
AI-research-assistant/
├── Backend/
├── Frontend/
└── README.md
```

## Getting started

This repository is currently being prepared as a full-stack application. The next steps are to scaffold the frontend and backend, connect the database and vector store, and integrate an LLM for document summarization and question answering.

### Suggested setup flow
1. Create the backend API for authentication, uploads, and document processing.
2. Create the frontend experience for upload, dashboard, chat, and comparison views.
3. Configure PostgreSQL with pgvector.
4. Integrate an LLM and embedding model.
5. Deploy the application to production.

### Example local development commands

```bash
cd Backend
npm install
npm run dev
```

```bash
cd Frontend
npm install
npm run dev
```

## Future roadmap

- Implement authentication and user profiles
- Add PDF upload and metadata extraction
- Build vector search and RAG workflows
- Add paper comparison and literature review generation
- Introduce saved chat history and citation navigation
- Deploy the full application to production

## Status

Current status: Project planning and documentation phase.
