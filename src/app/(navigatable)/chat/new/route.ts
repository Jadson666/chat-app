import { getDb, promisify } from '@/utils/db';
import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomId, senderId, content } = body;
  const db = getDb();

  const lastID = await new Promise((resolve, reject) => {
    db.run(`INSERT INTO msg(sender_id, room_id, text) VALUES(?,?,?)`, [senderId, roomId, content], function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this.lastID);
    });
  });

  await promisify(db, db.run, `UPDATE chat_room SET last_msg_id = ? WHERE id = ?`, [lastID, roomId])

  // notify all users in the room
  // io.in(roomId).emit(newMessage)

  return Response.json({ success: true });
}
