import http from 'http';
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initializeSocket from './socket';
import { WebSocketExpress } from 'websocket-express';

dotenv.config();

const app = express();

app.use(json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const server = http.createServer(app);
initializeSocket(server)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server }