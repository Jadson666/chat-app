import path from 'path';
import _sqlite3 from 'sqlite3';
const sqlite3 = _sqlite3.verbose();

const dbPath = path.join(process.cwd(), 'chat.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the profile database.');
});

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY, user_name varchar(255), display_name varchar(255), created_at timestamp DEFAULT CURRENT_TIMESTAMP)'
  );
  db.run(`CREATE TABLE IF NOT EXISTS
    chat_room (
      id integer PRIMARY KEY,
      name varchar(255),
      last_msg_id integer,
      FOREIGN KEY (last_msg_id) REFERENCES chat_room(id)
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS chat_room_user (
      id integer PRIMARY KEY,
      room_id integer,
      user_id integer,
      
      FOREIGN KEY (room_id) REFERENCES chat_room(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
  db.run(
    `CREATE TABLE IF NOT EXISTS msg (
      id integer PRIMARY KEY,
      sender_id integer NOT NULL,
      room_id integer NOT NULL,
      text varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES chat_room(id)
    )`
  );

  db.run('INSERT INTO users(id, user_name, display_name) VALUES(?, ?, ?)', [1, 'jasonlin', 'Jason Lin'], (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });

  db.run('INSERT INTO users(id, user_name, display_name) VALUES(?, ?, ?)', [2, 'yin', 'Yin YunTzu'], (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });

  db.run('INSERT INTO chat_room(id, name, last_msg_id) VALUES(?, ?, ?)', [1, 'Jason Lin, Yin YunTzu', 1],(err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });

  db.run('INSERT INTO chat_room_user(user_id, room_id) VALUES(?, ?)', [1, 1],(err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });

  db.run('INSERT INTO chat_room_user(user_id, room_id) VALUES(?, ?)', [2, 1],(err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });

  db.run('INSERT INTO msg(id, sender_id, room_id, text) VALUES(?, ?, ?, ?)', [1, 1, 1, 'Hello I\'m Jason!'],(err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Row was added to the table`);
  });
});

db.close();
