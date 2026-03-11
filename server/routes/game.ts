import { randomUUID } from 'crypto';
import express from 'express';

const router = express.Router();

const lobbies = new Set()

router.post<unknown, {}, { name: string }>('/create', (req, res) => {
  if (!req.body.name) {
    res.status(403).send({ success: false, error: 'Заполните название лобби' })
  }

  const lobby = {
    id: randomUUID(),
    name: req.body.name
  }

  lobbies.add(lobby)
  res.status(201).send({ success: true, lobby })
})

router.get('/list', (req, res) => {
  const lobbiesArr = Array.from(lobbies)

  res.status(200).send({ lobbies: lobbiesArr })
})

export default router
