import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(process.cwd(), 'chat.db');

export async function POST(req: Request) {
  const body = await req.json();
  const { username } = body;
  // query from DB by username, password
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
  const user = await new Promise((resolve, reject) =>
    db.get('select * from users where user_name = ?', username, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    })
  );
  db.close();
  return Response.json({ success: !!user, user });
}
