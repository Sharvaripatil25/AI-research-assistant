import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { Pool } from 'pg';
import fs from 'fs';

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
  userEmail?: string;
}

export interface ChatMessageRecord {
  id: string;
  sessionId?: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  datasets: string;
  sources: string;
  userEmail?: string;
}

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
}

const databaseUrl = process.env.DATABASE_URL;
const isPostgres = Boolean(
  databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
);

let pgPool: Pool | null = null;
let sqliteDb: any = null;

if (isPostgres) {
  const isCloud =
    databaseUrl!.includes('sslmode=require') ||
    databaseUrl!.includes('neon.tech') ||
    databaseUrl!.includes('supabase') ||
    databaseUrl!.includes('render.com') ||
    databaseUrl!.includes('railway.app') ||
    databaseUrl!.includes('aivencloud.com');

  pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: isCloud ? { rejectUnauthorized: false } : false,
  });
  console.log('📦 Database Mode: PostgreSQL');
} else {
  const dbDirectory = path.resolve(__dirname, '..', 'data');
  const dbPath = path.join(dbDirectory, 'app.db');
  fs.mkdirSync(dbDirectory, { recursive: true });

  // Dynamically require sqlite3 only when running in SQLite mode
  const sqlite = require('sqlite3').verbose();
  sqliteDb = new sqlite.Database(dbPath);
  console.log('📦 Database Mode: SQLite (Set DATABASE_URL in .env to use PostgreSQL)');
}

// Unified Query Helper
const query = async <T = any>(
  pgSql: string,
  sqliteSql: string,
  params: any[] = []
): Promise<T[]> => {
  if (isPostgres && pgPool) {
    const res = await pgPool.query(pgSql, params);
    return res.rows as T[];
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb!.all(sqliteSql, params, (err: any, rows: any) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }
  throw new Error('Database client not initialized');
};

const execute = async (
  pgSql: string,
  sqliteSql: string,
  params: any[] = []
): Promise<{ lastID?: number; rowCount?: number }> => {
  if (isPostgres && pgPool) {
    const res = await pgPool.query(pgSql, params);
    const lastID = res.rows.length > 0 && res.rows[0].id ? Number(res.rows[0].id) : undefined;
    return { lastID, rowCount: res.rowCount ?? 0 };
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb!.run(sqliteSql, params, function (this: any, err: any) {
        if (err) reject(err);
        else resolve({ lastID: this?.lastID, rowCount: this?.changes });
      });
    });
  }
  throw new Error('Database client not initialized');
};

export const initializeDatabase = async (): Promise<void> => {
  if (isPostgres && pgPool) {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL
      );
    `);
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS papers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT,
        year TEXT,
        "publishedIn" TEXT,
        abstract TEXT,
        tags TEXT,
        citations INTEGER,
        "uploadDate" TEXT,
        pages TEXT,
        doi TEXT,
        "userEmail" TEXT
      );
    `);
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        "sessionId" TEXT DEFAULT 'default',
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        datasets TEXT,
        sources TEXT,
        "userEmail" TEXT
      );
    `);
  } else if (sqliteDb) {
    await execute(
      '',
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL
      );`
    );
    await execute(
      '',
      `CREATE TABLE IF NOT EXISTS papers (
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
        doi TEXT,
        userEmail TEXT
      );`
    );
    await execute(
      '',
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        sessionId TEXT DEFAULT 'default',
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        datasets TEXT,
        sources TEXT,
        userEmail TEXT
      );`
    );

    try { await execute('', 'ALTER TABLE papers ADD COLUMN userEmail TEXT'); } catch {}
    try { await execute('', 'ALTER TABLE chat_messages ADD COLUMN userEmail TEXT'); } catch {}
  }
};

export const findUserByEmail = async (email: string): Promise<UserRecord | undefined> => {
  const rows = await query<UserRecord>(
    'SELECT id, email, "passwordHash" FROM users WHERE email = $1',
    'SELECT id, email, passwordHash FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

export const createUser = async (email: string, passwordHash: string): Promise<UserRecord> => {
  const result = await execute(
    'INSERT INTO users (email, "passwordHash") VALUES ($1, $2) RETURNING id',
    'INSERT INTO users (email, passwordHash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return { id: result.lastID!, email, passwordHash };
};

export const getAllPapers = async (userEmail?: string): Promise<PaperRecord[]> => {
  if (userEmail) {
    return query<PaperRecord>(
      'SELECT id, title, authors, year, "publishedIn", abstract, tags, citations, "uploadDate", pages, doi, "userEmail" FROM papers WHERE "userEmail" = $1 ORDER BY "uploadDate" DESC',
      'SELECT * FROM papers WHERE userEmail = ? ORDER BY uploadDate DESC',
      [userEmail]
    );
  }
  return query<PaperRecord>(
    'SELECT id, title, authors, year, "publishedIn", abstract, tags, citations, "uploadDate", pages, doi, "userEmail" FROM papers ORDER BY "uploadDate" DESC',
    'SELECT * FROM papers ORDER BY uploadDate DESC'
  );
};

export const getPaperById = async (id: string): Promise<PaperRecord | undefined> => {
  const rows = await query<PaperRecord>(
    'SELECT id, title, authors, year, "publishedIn", abstract, tags, citations, "uploadDate", pages, doi, "userEmail" FROM papers WHERE id = $1',
    'SELECT * FROM papers WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const addPaper = async (paper: PaperRecord): Promise<PaperRecord> => {
  await execute(
    `INSERT INTO papers (id, title, authors, year, "publishedIn", abstract, tags, citations, "uploadDate", pages, doi, "userEmail")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       authors = EXCLUDED.authors,
       year = EXCLUDED.year,
       "publishedIn" = EXCLUDED."publishedIn",
       abstract = EXCLUDED.abstract,
       tags = EXCLUDED.tags,
       citations = EXCLUDED.citations,
       "uploadDate" = EXCLUDED."uploadDate",
       pages = EXCLUDED.pages,
       doi = EXCLUDED.doi,
       "userEmail" = EXCLUDED."userEmail"`,
    `INSERT OR REPLACE INTO papers (id, title, authors, year, publishedIn, abstract, tags, citations, uploadDate, pages, doi, userEmail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paper.id,
      paper.title,
      paper.authors,
      paper.year,
      paper.publishedIn,
      paper.abstract,
      paper.tags,
      paper.citations,
      paper.uploadDate,
      paper.pages || null,
      paper.doi || null,
      paper.userEmail || null,
    ]
  );
  return paper;
};

export const deletePaperById = async (id: string, userEmail?: string): Promise<void> => {
  if (userEmail) {
    await execute(
      'DELETE FROM papers WHERE id = $1 AND "userEmail" = $2',
      'DELETE FROM papers WHERE id = ? AND userEmail = ?',
      [id, userEmail]
    );
  } else {
    await execute('DELETE FROM papers WHERE id = $1', 'DELETE FROM papers WHERE id = ?', [id]);
  }
};

export const clearAllPapersFromDb = async (userEmail?: string): Promise<void> => {
  if (userEmail) {
    await execute(
      'DELETE FROM papers WHERE "userEmail" = $1',
      'DELETE FROM papers WHERE userEmail = ?',
      [userEmail]
    );
  } else {
    await execute('DELETE FROM papers', 'DELETE FROM papers');
  }
};

export const getChatHistory = async (userEmail?: string): Promise<ChatMessageRecord[]> => {
  if (userEmail) {
    return query<ChatMessageRecord>(
      'SELECT id, "sessionId", sender, text, timestamp, datasets, sources, "userEmail" FROM chat_messages WHERE "userEmail" = $1 ORDER BY id ASC',
      'SELECT * FROM chat_messages WHERE userEmail = ? ORDER BY id ASC',
      [userEmail]
    );
  }
  return query<ChatMessageRecord>(
    'SELECT id, "sessionId", sender, text, timestamp, datasets, sources, "userEmail" FROM chat_messages ORDER BY id ASC',
    'SELECT * FROM chat_messages ORDER BY id ASC'
  );
};

export const addChatMessage = async (message: ChatMessageRecord): Promise<ChatMessageRecord> => {
  await execute(
    `INSERT INTO chat_messages (id, "sessionId", sender, text, timestamp, datasets, sources, "userEmail")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       "sessionId" = EXCLUDED."sessionId",
       sender = EXCLUDED.sender,
       text = EXCLUDED.text,
       timestamp = EXCLUDED.timestamp,
       datasets = EXCLUDED.datasets,
       sources = EXCLUDED.sources,
       "userEmail" = EXCLUDED."userEmail"`,
    `INSERT INTO chat_messages (id, sessionId, sender, text, timestamp, datasets, sources, userEmail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      message.id,
      message.sessionId || 'default',
      message.sender,
      message.text,
      message.timestamp,
      message.datasets,
      message.sources,
      message.userEmail || null,
    ]
  );
  return message;
};

export const deleteChatMessageById = async (id: string): Promise<void> => {
  await execute(
    'DELETE FROM chat_messages WHERE id = $1',
    'DELETE FROM chat_messages WHERE id = ?',
    [id]
  );
};

export const deleteChatSession = async (sessionId: string, userEmail?: string): Promise<void> => {
  if (userEmail) {
    await execute(
      'DELETE FROM chat_messages WHERE ("sessionId" = $1 OR id = $1) AND "userEmail" = $2',
      'DELETE FROM chat_messages WHERE (sessionId = ? OR id = ?) AND userEmail = ?',
      [sessionId, sessionId, userEmail]
    );
  } else {
    await execute(
      'DELETE FROM chat_messages WHERE "sessionId" = $1 OR id = $1',
      'DELETE FROM chat_messages WHERE sessionId = ? OR id = ?',
      [sessionId, sessionId]
    );
  }
};

export const clearAllChatHistory = async (userEmail?: string): Promise<void> => {
  if (userEmail) {
    await execute(
      'DELETE FROM chat_messages WHERE "userEmail" = $1',
      'DELETE FROM chat_messages WHERE userEmail = ?',
      [userEmail]
    );
  } else {
    await execute('DELETE FROM chat_messages', 'DELETE FROM chat_messages');
  }
};
