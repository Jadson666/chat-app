## Purpose
An chat app MVP with following features:
1. connect users by creating new 1-1 chat room
2. support basic profile creation (habit, country, date of birth)
3. persist data on SQLite database
4. public API routed by Next.js
## Tech Stack
- Next.js
- SQLite
- Shadcn-ui
- tailwindCSS
- Websocket
## Preview
![chat room](/static/chat-room-demo.png)
## Getting Started

first, start the server in your local

```bash
yarn

## initialize DB instance
yarn start:db

## start backend and web server
yarn dev
```

then open http://localhost:3000/ on browser to visit login page

in the MVP, login page only check whether user exists or not without checking password

#### tools

DB Browser for SQLite: https://sqlitebrowser.org/
