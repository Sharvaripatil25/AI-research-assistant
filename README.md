# AI Research Assistant 🔬

AI Research Assistant is a full-stack, AI-powered academic research platform designed for researchers, students, and engineers. It allows users to store academic papers, perform **Retrieval-Augmented Generation (RAG)** over their personal paper library using **Google Gemini 2.5 Flash**, search live **arXiv preprints**, compare model methodologies side-by-side, and synthesize automated literature reviews.

---

## 🌟 Key Features Implemented

### 1. 🤖 Interactive RAG Research Assistant (`/chat`)
- **Retrieval-Augmented Generation (RAG)**: Scores and retrieves relevant research papers from your personal library based on weighted query match algorithm (title, abstract, tags, authors).
- **Dual-Engine Response Generation**:
  - **Primary Engine**: Google Gemini API integration (`@google/genai` model `gemini-2.5-flash`).
  - **Fallback Engine**: Grounded Local RAG Synthesis for offline operation.
- **Interactive Source Citations**: Links every answer back to specific research papers in your library.
- **Benchmark Dataset Extraction**: Automatically identifies referenced datasets (e.g. *ImageNet, COCO, GLUE, SQuAD, WMT 2014*) and highlights them as tags.
- **Multi-Session Chat History**: Manage and navigate multiple chat sessions backed by SQLite database storage.

### 2. 🌐 Live Academic Web Search (arXiv Integration)
- **Real-Time arXiv Querying**: Search preprints across arXiv using the backend arXiv XML query API.
- **One-Click Library Import**: Import searched arXiv papers directly into your persistent local library.

### 3. 📚 Workspace Paper Library (`/library`)
- **Full Library CRUD**: Store paper title, authors, year, journal/venue, abstract, tags, citation counts, DOI, and page numbers.
- **SQLite Persistence**: All papers and metadata are stored locally in an embedded SQLite database (`Backend/data/app.db`).
- **Search & Filtering**: Instant search across titles, abstracts, tags, and publication year filters.

### 4. 📤 Paper Upload & Ingestion (`/upload`)
- Drag-and-drop file upload interface for manual paper entry and metadata extraction.
- Tabbed interface to toggle between local PDF upload and live arXiv search import.

### 5. ⚖️ Multi-Paper Comparison Engine (`/compare`)
- Select multiple papers to generate a structured side-by-side comparison matrix covering architectural differences, dataset usage, accuracy trade-offs, and key findings.

### 6. 📝 Automated Literature Review Generator (`/review`)
- Synthesize topic-focused literature reviews across selected library papers with configurable review types (e.g., Comprehensive, Methodology Focus, Citation Analysis).

### 7. 📁 Collections & Organization (`/collections`)
- Organize research papers into custom tagged collections (e.g., *Transformer Architectures, Computer Vision, Reinforcement Learning*).

### 8. 📊 Analytics & Metrics Dashboard (`/dashboard`)
- Visual metrics tracking total papers, citation impact, publication timeline distribution, and top research keywords.

### 9. 🔐 Authentication & Profile Management (`/auth`)
- User signup and login system utilizing `bcryptjs` password hashing, JWT (`jsonwebtoken`), and `express-session`.

### 10. ⚙️ Settings & Customization (`/settings`)
- Configurable **Google Gemini API Key** setting.
- Theme switcher (Dark Mode & Light Mode).
- User profile updates and system diagnostics status.

---

## 🏗️ Architecture & Technology Stack

### **Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM (v6)
- **UI & Styling**: Vanilla CSS with custom CSS variables (Design System with Dark/Light mode support)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### **Backend**
- **Runtime & Server**: Node.js + Express.js + TypeScript (`ts-node-dev`)
- **Database**: SQLite3 (`sqlite3`) with custom async database helpers
- **Authentication**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `express-session`
- **AI Integration**: `@google/genai` SDK (Gemini 2.5 Flash)
- **External APIs**: arXiv REST API

---

## 📂 Project Structure

```text
AI-research-assistant/
├── Backend/
│   ├── data/              # SQLite database storage (app.db)
│   ├── src/
│   │   ├── index.ts       # Express server & API endpoints
│   │   ├── rag.ts         # RAG retrieval algorithm & Gemini AI generation
│   │   ├── db.ts          # SQLite schema & database query helpers
│   │   └── auth.ts        # User registration, authentication & JWT middleware
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (AppShell)
│   │   ├── context/       # Global state management (ResearchContext)
│   │   ├── pages/         # Application pages
│   │   │   ├── AIChatPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   ├── CollectionsPage.tsx
│   │   │   ├── ComparePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LibraryPage.tsx
│   │   │   ├── LiteratureReviewPage.tsx
│   │   │   ├── PaperDetailPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── UploadPage.tsx
│   │   ├── App.tsx        # Router setup & route definitions
│   │   ├── main.tsx
│   │   └── styles.css     # Global CSS design system
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/) for live LLM responses.

---

### Local Setup Instructions

#### 1. Clone the Repository & Install Dependencies

**Backend Setup:**
```bash
cd Backend
npm install
```

**Frontend Setup:**
```bash
cd Frontend
npm install
```

---

#### 2. Environment Configuration

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
SESSION_SECRET=your-custom-session-secret
GEMINI_API_KEY=your-google-gemini-api-key # Optional: Enables Gemini 2.5 Flash LLM
```

*(Note: If `GEMINI_API_KEY` is not set, the RAG engine seamlessly uses the Grounded Local RAG Synthesis engine).*

---

#### 3. Run Development Servers

**Start Backend Server** (Runs on `http://localhost:5000`):
```bash
cd Backend
npm run dev
```

**Start Frontend Application** (Runs on `http://localhost:3000` or `http://localhost:5173`):
```bash
cd Frontend
npm run dev
```

---

## 🔬 How the RAG Pipeline Works

1. **Document Storage**: Uploaded or arXiv-imported papers are stored in SQLite with their titles, abstracts, authors, tags, and metadata.
2. **Query Keyword Scoring**: When a question is submitted, `retrieveRelevantPapers()` in `rag.ts` tokenizes the input query and ranks stored papers based on field matches:
   - **Exact Title Phrase**: $+10$ score
   - **Title Token**: $+4$ score per token
   - **Tag Token**: $+3$ score per token
   - **Abstract Token**: $+2$ score per token
   - **Author Token**: $+1$ score per token
3. **Context Construction**: Top matching papers are aggregated into a grounded context payload.
4. **AI Answer Generation**: Context is sent to **Gemini 2.5 Flash** (`gemini-2.5-flash`) via `@google/genai`.
5. **Citations & Datasets**: The output includes explicit source citations and extracted dataset tags for complete transparency.

