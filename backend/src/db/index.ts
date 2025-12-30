import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Sender } from '../types';

const db = new Database('spur-chat.db');

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create tables (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT CHECK(sender IN ('user', 'ai')) NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );
`);

export function createConversation(): string {
  const convId = uuidv4();
  db.prepare('INSERT OR IGNORE INTO conversations (id) VALUES (?)').run(convId);
  return convId;
}

export function getConversationHistory(convId: string): ChatMessage[] {
  const rows = db.prepare(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
  ).all(convId) as any[];
  
  return rows.map((row: any) => ({
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender as Sender,
    text: row.text,
    createdAt: row.created_at,
  }));
}

export function saveMessage(message: ChatMessage): void {
  // Ensure conversation exists first
  db.prepare('INSERT OR IGNORE INTO conversations (id) VALUES (?)')
    .run(message.conversationId);
  
  // Then save message
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender, text, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(message.id, message.conversationId, message.sender, message.text, message.createdAt);
}
