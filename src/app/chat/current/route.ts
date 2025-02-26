import { getDb, promisify } from '@/utils/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const roomId = searchParams.get('roomId');
  const db = getDb();
  const allChats = await promisify(db, db.all, `select msg.*, users.display_name from msg, users where room_id = ? and sender_id = users.id`, roomId)
  return Response.json({ chats: allChats })
}
