import { UserResponse } from '@/types/response';
import { getDb, promisify } from '@/utils/db';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const db = getDb();
  const user: UserResponse = await promisify(db, db.get, 'SELECT * FROM users WHERE id = ?', [userId]);
  return Response.json({ user });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const { userId, country, dateOfBirth, habit } = body;
  const db = getDb();
  await promisify(db, db.run, 'UPDATE users SET country = ?, habit = ?, date_of_birth = ? WHERE id = ?', [
    country,
    habit,
    dateOfBirth,
    userId
  ]);
  return Response.json({ success: true });
};
