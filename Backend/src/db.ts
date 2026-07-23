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
  `);
  await runAsync(`
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
  `);
  await runAsync(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      sessionId TEXT DEFAULT 'default',
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      datasets TEXT,
      sources TEXT
    );
  `);
};

export const clearAllPapersFromDb = async (): Promise<void> => {
  await runAsync('DELETE FROM papers');
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
  return allAsync<ChatMessageRecord>('SELECT * FROM chat_messages ORDER BY id ASC');
};

export const addChatMessage = async (message: ChatMessageRecord): Promise<ChatMessageRecord> => {
  await runAsync(`
    INSERT INTO chat_messages (id, sender, text, timestamp, datasets, sources)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [message.id, message.sender, message.text, message.timestamp, message.datasets, message.sources]);
  return message;
};

export const deleteChatMessageById = async (id: string): Promise<void> => {
  await runAsync('DELETE FROM chat_messages WHERE id = ?', [id]);
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  await runAsync('DELETE FROM chat_messages WHERE sessionId = ? OR id = ?', [sessionId, sessionId]);
};

export const clearAllChatHistory = async (): Promise<void> => {
  await runAsync('DELETE FROM chat_messages');
};

