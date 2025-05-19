import app from './app';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const gameNamespace = io.of('/game')
gameNamespace.on('connection', (socket) => {
  console.log(socket)
  socket.emit('greetings')
  socket.broadcast.emit('playerConnected')
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server, io }