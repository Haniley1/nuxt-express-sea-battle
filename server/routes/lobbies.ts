import express from "express";
import { createLobby, getLobbies, type Lobby } from "../models/Lobby";

const router = express.Router();

router.get<{}, unknown, Lobby[]>('/list', (req, res) => {
  const lobbies = getLobbies()
  console.log(lobbies)
  res.status(200).json(lobbies)
})

router.post<{}, Lobby, { lobbyName: string }>("/create", (req, res) => {
  const room = createLobby(req.body.lobbyName);
  res.status(201).json(room);
});

export default router;

