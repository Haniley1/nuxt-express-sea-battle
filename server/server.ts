import http from 'http';
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initializeSocket from './socket';
import authRouter from './routes/auth'
import gameRouter from './routes/game'

dotenv.config();

const app = express();

app.use(json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/auth', authRouter)
app.use('/game', gameRouter)

const server = http.createServer(app);
initializeSocket(server)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server }