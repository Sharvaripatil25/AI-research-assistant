import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { registerUser, loginUser, authMiddleware } from './auth';
import { initializeDatabase, getAllPapers, getPaperById, addPaper, deletePaperById, clearAllPapersFromDb, getChatHistory, addChatMessage, deleteChatMessageById, deleteChatSession, clearAllChatHistory } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'research-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

export interface Paper {
  id: string;
  title: string;
  authors: string;
  year: string;
  publishedIn: string;
  abstract: string;
  tags: string[];
  citations: number;
  uploadDate: string;
  pages?: string;
  doi?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  datasets?: string[];
  sources?: string[];
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AI Research Assistant backend is running' });
});

/* Authentication Routes */
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const user = await registerUser(email, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  res.json({ user: (req as Request & { user?: { id: number; email: string } }).user });
});

/* Papers API */
app.get('/api/papers', async (_req: Request, res: Response) => {
  const papers = await getAllPapers();
  res.json({ papers, total: papers.length });
});

app.get('/api/papers/:id', async (req: Request, res: Response) => {
  const paperId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paper = await getPaperById(paperId);
  if (!paper) {
    res.status(404).json({ message: 'Paper not found' });
    return;
  }
  res.json({ paper });
});

app.post('/api/papers', async (req: Request, res: Response) => {
  const { title, authors, year, tags, abstract, publishedIn, pages, doi } = req.body;
  if (!title) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const newPaper = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    authors: authors || 'Unknown Author',
    year: year || new Date().getFullYear().toString(),
    publishedIn: publishedIn || 'Uploaded Paper',
    abstract: abstract || 'Uploaded research paper document for AI analysis.',
    tags: JSON.stringify(tags || ['General ML']),
    citations: 0,
    uploadDate: new Date().toISOString(),
    pages,
    doi
  };

  const paper = await addPaper(newPaper);
  res.status(201).json({ message: 'Paper uploaded successfully', paper });
});

app.delete('/api/papers', async (_req: Request, res: Response) => {
  await clearAllPapersFromDb();
  res.json({ message: 'All papers deleted successfully' });
});

app.delete('/api/papers/:id', async (req: Request, res: Response) => {
  const paperId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deletePaperById(paperId);
  res.json({ message: 'Paper deleted successfully' });
});

/* AI Chat API */
app.get('/api/chat', async (_req: Request, res: Response) => {
  const messages = await getChatHistory();
  res.json({ messages });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'Message text is required' });
    return;
  }

  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    sender: 'user',
    text: message,
    timestamp: 'Just now'
  };

  await addChatMessage({
    id: userMsg.id,
    sender: userMsg.sender,
    text: userMsg.text,
    timestamp: userMsg.timestamp,
    datasets: JSON.stringify([]),
    sources: JSON.stringify([])
  });

  let aiText = `Regarding "${message}", attention mechanisms and self-attention layers enable neural models to dynamically route contextual information across all tokens.`;
  let sources = ['Attention Is All You Need (2017)', 'BERT (2018)'];

  if (message.toLowerCase().includes('dataset')) {
    aiText = 'The most frequently cited benchmarking datasets in your paper library include ImageNet, COCO, BooksCorpus, and WMT 2014 En-De.';
    sources = ['EfficientNet (2019)', 'ViT (2020)', 'Attention Is All You Need (2017)'];
  } else if (message.toLowerCase().includes('compare') || message.toLowerCase().includes('vs')) {
    aiText = 'Comparing Transformer backbones with CNNs shows that Transformers achieve higher SOTA accuracy on large datasets but require longer warm-up schedules.';
    sources = ['ViT (2020)', 'EfficientNet (2019)'];
  }

  const assistantMsg: ChatMessage = {
    id: (Date.now() + 1).toString(),
    sender: 'assistant',
    text: aiText,
    timestamp: 'Just now',
    sources
  };

  await addChatMessage({
    id: assistantMsg.id,
    sender: assistantMsg.sender,
    text: assistantMsg.text,
    timestamp: assistantMsg.timestamp,
    datasets: JSON.stringify([]),
    sources: JSON.stringify(sources)
  });

  res.status(201).json({ userMessage: userMsg, assistantMessage: assistantMsg });
});

app.delete('/api/chat', async (_req: Request, res: Response) => {
  await clearAllChatHistory();
  res.json({ message: 'Chat history cleared successfully' });
});

app.delete('/api/chat/session/:sessionId', async (req: Request, res: Response) => {
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  await deleteChatSession(sessionId);
  res.json({ message: 'Chat session deleted successfully' });
});

app.delete('/api/chat/:id', async (req: Request, res: Response) => {
  const messageId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteChatMessageById(messageId);
  res.json({ message: 'Chat message deleted successfully' });
});

/* Literature Review API */
app.post('/api/review/generate', (req: Request, res: Response) => {
  const { topic, selectedPapers, reviewType, instructions } = req.body;
  res.json({
    status: 'success',
    topic: topic || 'Transformer-based models in computer vision',
    reviewType: reviewType || 'Comprehensive',
    selectedPapersCount: selectedPapers ? selectedPapers.length : 3,
    summary: `Literature review synthesized for "${topic}". Found key thematic alignment in attention mechanisms and model scaling across selected papers.`
  });
});

/* Analytics API */
app.get('/api/analytics', async (_req: Request, res: Response) => {
  const papers = await getAllPapers();
  const messages = await getChatHistory();
  res.json({
    totalPapers: papers.length,
    conversations: messages.filter((m) => m.sender === 'user').length,
    reviewsGenerated: 15,
    hoursSaved: 36.5,
    trends: {
      papersUploaded: '+40% vs last 30 days',
      conversations: '+20% vs last 30 days',
      reviews: '+60% vs last 30 days',
      hoursSaved: '+25% vs last 30 days'
    }
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the AI Research Assistant API' });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();
