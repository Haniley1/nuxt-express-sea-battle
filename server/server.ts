import { randomUUID } from 'crypto';
import { Player } from './../shared/model/Player';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const createPlayer = () => ({
  uuid: randomUUID(),
  nickname: `Player-${Math.floor(Math.random() * 1000)}`,
  avatar: `https://api.dicebear.com/5.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`
})

const gameNamespace = io.of('/game')
gameNamespace.on('connection', (socket) => {
  const room = 'game-room-1'; 
  socket.join(room);
  socket.broadcast.to(room).emit('playerConnected', createPlayer());

  socket.on('disconnect', () => {
    console.log('DISCONNECTED')
    socket.broadcast.emit('playerDisconnected');
  })
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server, io }