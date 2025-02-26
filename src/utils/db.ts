import path from 'path';
import sqlite3 from 'sqlite3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisify = async <T>(db: any, dbApi: any, sql: string, dataArray: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbApi.call(db, sql, dataArray, (err: any, row: any) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

export const getDb = (role = sqlite3.OPEN_READWRITE) => {
  const dbPath = path.join(process.cwd(), 'chat.db');
  const db = new sqlite3.Database(dbPath, role);
  return db
}
