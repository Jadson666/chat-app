// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisify = async (db: any, dbApi: any, sql: string, dataArray: any) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbApi.call(db, sql, dataArray, (err: any, row: any) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};
