import { getDb } from '@/utils/db';
import { type NextRequest } from 'next/server';

// get all chat room by a user
export async function GET(req: NextRequest) {
  const db = getDb();
  const searchParams = req.nextUrl.searchParams;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = searchParams.get('userId');
  // query chat room by userId

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chats: any[] = await new Promise((resolve, reject) =>
    db.all(
      `select msg.id msg_id,msg.text, msg.created_at, x.name room_name, x.room_id, x.user_id
       from msg 
       RIGHT JOIN (select * from chat_room JOIN chat_room_user 
       where chat_room.id = chat_room_user.room_id and chat_room_user.user_id = ?) x
       ON msg.id = x.last_msg_id`,
      userId,
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    )
  );

  const parsedChats = chats.map((chat) => ({
    roomId: chat.room_id,
    roomName: chat.room_name,
    lastChat: chat.text
  }));

  return Response.json({ chats: parsedChats });
}

/**
 * select msg.id msg_id, x.name room_name, x.room_id, x.user_id
from msg 
RIGHT JOIN (select * from chat_room JOIN chat_room_user 
       where chat_room.id = chat_room_user.room_id and chat_room_user.user_id = 1) x
ON msg.room_id = x.id	 
 */
