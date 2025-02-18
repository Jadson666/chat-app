import { promisify } from '@/utils/db';
import { NextRequest } from 'next/server';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(process.cwd(), 'chat.db');

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const roomId = searchParams.get('roomId');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
  const allChats = await promisify(db, db.all, `select msg.*, users.display_name from msg, users where room_id = ? and sender_id = users.id`, roomId)
  return Response.json({ chats: allChats })
}
