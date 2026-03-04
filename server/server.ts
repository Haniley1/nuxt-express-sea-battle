import { Player } from './../shared/model/Player';
import { randomUUID } from 'crypto';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const createPlayer = (nickname: string) => ({
  uuid: randomUUID(),
  nickname,
  avatar: `https://api.dicebear.com/5.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`
})

const PLAYERS_JSON_PATH = './data/players.json'
// == PLAYERS == //
app.post<{ nickname: string }>('/players/create', function (req, res) {
  const player = createPlayer(req.params.nickname)

  fs.writeFile(PLAYERS_JSON_PATH, JSON.stringify(player), (err) => {
    if (err) {
      res.status(403).send('Ошибка при создании игрока')
      return
    }

    res.send(player)
  })
})
// == PLAYERS == //

// == GAME SOCKET == //
const gameNamespace = io.of('/game')
gameNamespace.on('connection', (socket) => {
  const room = 'game-room-1'; 
  socket.once('handshake', (player: Player) => {
    socket.join(room);
    socket.broadcast.to(room).emit('playerConnected', player);
  })

  socket.on('disconnect', () => {
    console.log('DISCONNECTED')
    socket.broadcast.emit('playerDisconnected');
  })
})
// == GAME SOCKET == //

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server, io }