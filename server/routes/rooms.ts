import express from "express";
import { createRoom, type Room } from "../socket/rooms";

const router = express.Router();

router.post<{}, Room, { roomName: string }>("/", (req, res) => {
  const room = createRoom(req.body.roomName);
  res.status(201).json(room);
});

export default router;

