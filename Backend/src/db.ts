import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbDirectory = path.resolve(__dirname, '..', 'data');
const dbPath = path.join(dbDirectory, 'app.db');
fs.mkdirSync(dbDirectory, { recursive: true });

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath);

type SerializedStringArray = string | null;

type RunResult = sqlite3.RunResult;

export interface PaperRecord {
  id: string;
  title: string;
  authors: string;
  year: string;
  publishedIn: string;
  abstract: string;
  tags: string;
  citations: number;
  uploadDate: string;
  pages?: string;
  doi?: string;
}

export interface ChatMessageRecord {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  datasets: string;
  sources: string;
}

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
}

const serializeTags = (value: string[] | undefined): string => JSON.stringify(value ?? []);
const serializeOptionalList = (value: string[] | undefined): string => JSON.stringify(value ?? []);
const parseList = (value: SerializedStringArray): string[] => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const runAsync = (sql: string, params: any[] = []): Promise<RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const getAsync = <T>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T | undefined);
      }
    });
  });
};

const allAsync = <T>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
};

export const initializeDatabase = async (): Promise<void> => {
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS papers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT,
      year TEXT,
      publishedIn TEXT,
      abstract TEXT,
      tags TEXT,
      citations INTEGER,
      uploadDate TEXT,
      pages TEXT,
      doi TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      datasets TEXT,
      sources TEXT
    );
  `);

  const seedCheck = await getAsync<{ count: number }>('SELECT COUNT(*) AS count FROM papers');
  if (!seedCheck?.count) {
    const seedPapers: PaperRecord[] = [
      {
        id: 'attention-is-all-you-need',
        title: 'Attention Is All You Need',
        authors: 'Vaswani, Shazeer, Parmar, et al.',
        year: '2017',
        publishedIn: 'NeurIPS 2017',
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.',
        tags: serializeTags(['NLP', 'Transformer']),
        citations: 128450,
        uploadDate: '2026-07-20T10:00:00Z',
        pages: '5998–6008',
        doi: '10.5555/3295222.3295349'
      },
      {
        id: 'efficientnet',
        title: 'EfficientNet: Rethinking Model Scaling',
        authors: 'Tan & Le',
        year: '2019',
        publishedIn: 'ICML 2019',
        abstract: 'Convolutional Neural Networks are commonly developed at a fixed resource budget. In this paper, we systematically study model scaling and identify that carefully balancing network depth, width, and resolution can lead to better performance.',
        tags: serializeTags(['Computer Vision', 'CNN']),
        citations: 18420,
        uploadDate: '2026-07-19T14:30:00Z',
        pages: '6105-6114',
        doi: '10.48550/arXiv.1905.11946'
      },
      {
        id: 'gnn-survey',
        title: 'A Survey on Graph Neural Networks',
        authors: 'Zhou et al.',
        year: '2020',
        publishedIn: 'IEEE TNNLS 2020',
        abstract: 'Deep learning has revolutionized many machine learning tasks. In recent years, graph neural networks (GNNs) have emerged as powerful tools for processing non-Euclidean data structured as graphs.',
        tags: serializeTags(['Graph ML', 'Survey']),
        citations: 9540,
        uploadDate: '2026-07-17T09:15:00Z'
      },
      {
        id: 'rl-robotics',
        title: 'Reinforcement Learning for Robotics',
        authors: 'Kober et al.',
        year: '2013',
        publishedIn: 'IJRR 2013',
        abstract: 'Reinforcement learning offers to robotics a framework and a set of tools for the design of sophisticated and hard-to-engineer behaviors.',
        tags: serializeTags(['Robotics', 'RL']),
        citations: 14200,
        uploadDate: '2026-07-15T11:00:00Z'
      },
      {
        id: 'bert-pretraining',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers',
        authors: 'Devlin et al.',
        year: '2018',
        publishedIn: 'NAACL 2019',
        abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.',
        tags: serializeTags(['NLP', 'BERT']),
        citations: 98400,
        uploadDate: '2026-07-14T16:20:00Z'
      },
      {
        id: 'vit-image-16x16',
        title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition',
        authors: 'Dosovitskiy et al.',
        year: '2020',
        publishedIn: 'ICLR 2021',
        abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. We show that a pure transformer applied directly to sequences of image patches performs very well.',
        tags: serializeTags(['Computer Vision', 'ViT']),
        citations: 24300,
        uploadDate: '2026-07-12T13:45:00Z'
      }
    ];

    for (const paper of seedPapers) {
      await runAsync(`
        INSERT INTO papers (id, title, authors, year, publishedIn, abstract, tags, citations, uploadDate, pages, doi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [paper.id, paper.title, paper.authors, paper.year, paper.publishedIn, paper.abstract, paper.tags, paper.citations, paper.uploadDate, paper.pages, paper.doi]);
    }
  }

  const chatSeedCheck = await getAsync<{ count: number }>('SELECT COUNT(*) AS count FROM chat_messages');
  if (!chatSeedCheck?.count) {
    await runAsync(`
      INSERT INTO chat_messages (id, sender, text, timestamp, datasets, sources)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['1', 'user', 'What datasets are commonly used in these papers?', '2 hours ago', serializeOptionalList([]), serializeOptionalList([])]);

    await runAsync(`
      INSERT INTO chat_messages (id, sender, text, timestamp, datasets, sources)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['2', 'assistant', "Based on the papers you've uploaded, here are the most commonly used benchmarking datasets across the collection:", '2 hours ago', serializeOptionalList(['ImageNet (used in 4 papers)', 'COCO (used in 3 papers)', 'CIFAR-10 / CIFAR-100 (used in 2 papers)', 'MNIST (used in 2 papers)', 'PASCAL VOC (used in 2 papers)']), serializeOptionalList(['EfficientNet (2019)', 'ViT (2020)', 'ResNet (2016)', '+1 more'])]);
  }
};

export const findUserByEmail = async (email: string): Promise<UserRecord | undefined> => {
  return getAsync<UserRecord>('SELECT id, email, passwordHash FROM users WHERE email = ?', [email]);
};

export const createUser = async (email: string, passwordHash: string): Promise<UserRecord> => {
  const info = await runAsync('INSERT INTO users (email, passwordHash) VALUES (?, ?)', [email, passwordHash]);
  return { id: Number(info.lastID), email, passwordHash };
};

export const getAllPapers = async (): Promise<PaperRecord[]> => {
  return allAsync<PaperRecord>('SELECT * FROM papers ORDER BY uploadDate DESC');
};

export const getPaperById = async (id: string): Promise<PaperRecord | undefined> => {
  return getAsync<PaperRecord>('SELECT * FROM papers WHERE id = ?', [id]);
};

export const addPaper = async (paper: PaperRecord): Promise<PaperRecord> => {
  await runAsync(`
    INSERT INTO papers (id, title, authors, year, publishedIn, abstract, tags, citations, uploadDate, pages, doi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [paper.id, paper.title, paper.authors, paper.year, paper.publishedIn, paper.abstract, paper.tags, paper.citations, paper.uploadDate, paper.pages, paper.doi]);
  return paper;
};

export const deletePaperById = async (id: string): Promise<void> => {
  await runAsync('DELETE FROM papers WHERE id = ?', [id]);
};

export const getChatHistory = async (): Promise<ChatMessageRecord[]> => {
  return allAsync<ChatMessageRecord>('SELECT * FROM chat_messages ORDER BY timestamp DESC');
};

export const addChatMessage = async (message: ChatMessageRecord): Promise<ChatMessageRecord> => {
  await runAsync(`
    INSERT INTO chat_messages (id, sender, text, timestamp, datasets, sources)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [message.id, message.sender, message.text, message.timestamp, message.datasets, message.sources]);
  return message;
};
