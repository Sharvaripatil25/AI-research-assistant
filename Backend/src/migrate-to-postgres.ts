import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || (!databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('postgresql://'))) {
  console.error('❌ Error: DATABASE_URL is not configured or not a PostgreSQL URL in Backend/.env');
  console.log('Example: DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require');
  process.exit(1);
}

const dbDirectory = path.resolve(__dirname, '..', 'data');
const sqlitePath = path.join(dbDirectory, 'app.db');

if (!fs.existsSync(sqlitePath)) {
  console.log('ℹ️ No SQLite database found at Backend/data/app.db. Skipping data migration.');
  process.exit(0);
}

const isCloud =
  databaseUrl.includes('sslmode=require') ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('supabase') ||
  databaseUrl.includes('render.com') ||
  databaseUrl.includes('railway.app') ||
  databaseUrl.includes('aivencloud.com');

const pgPool = new Pool({
  connectionString: databaseUrl,
  ssl: isCloud ? { rejectUnauthorized: false } : false,
});

const sqliteDb = new (sqlite3.verbose().Database)(sqlitePath);

const runMigration = async () => {
  console.log('🚀 Starting SQLite to PostgreSQL Data Migration...');

  try {
    // 1. Ensure Postgres tables exist
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

    // 2. Migrate Users
    const users: any[] = await new Promise((res, rej) => sqliteDb.all('SELECT * FROM users', (err, rows) => err ? rej(err) : res(rows)));
    let userCount = 0;
    for (const u of users) {
      await pgPool.query(
        `INSERT INTO users (email, "passwordHash") VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
        [u.email, u.passwordHash]
      );
      userCount++;
    }
    console.log(`✅ Migrated ${userCount} users.`);

    // 3. Migrate Papers
    const papers: any[] = await new Promise((res, rej) => sqliteDb.all('SELECT * FROM papers', (err, rows) => err ? rej(err) : res(rows)));
    let paperCount = 0;
    for (const p of papers) {
      await pgPool.query(
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
        [p.id, p.title, p.authors, p.year, p.publishedIn, p.abstract, p.tags, p.citations, p.uploadDate, p.pages || null, p.doi || null, p.userEmail || null]
      );
      paperCount++;
    }
    console.log(`✅ Migrated ${paperCount} papers.`);

    // 4. Migrate Chat Messages
    const messages: any[] = await new Promise((res, rej) => sqliteDb.all('SELECT * FROM chat_messages', (err, rows) => err ? rej(err) : res(rows)));
    let msgCount = 0;
    for (const m of messages) {
      await pgPool.query(
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
        [m.id, m.sessionId || 'default', m.sender, m.text, m.timestamp, m.datasets, m.sources, m.userEmail || null]
      );
      msgCount++;
    }
    console.log(`✅ Migrated ${msgCount} chat messages.`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    sqliteDb.close();
    await pgPool.end();
  }
};

runMigration();
