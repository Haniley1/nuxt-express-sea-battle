import { randomUUID } from "crypto";
import { Player as PlayerInterface } from "../../shared/model/Player";
import db from "../db";

export class Player implements PlayerInterface {
  uuid: string;
  nickname: string;
  avatar: string;

  constructor(uuid: string, nickname: string, avatar: string) {
    this.uuid = uuid;
    this.nickname = nickname;
    this.avatar = avatar;
  }

  static async create(nickname: string) {
    const uuid = randomUUID();
    const cleanNickname = nickname.trim().replace(/[<>&'"]/g, '');
    const avatar = `https://api.dicebear.com/5.x/avataaars/svg?seed=${Math.floor(Math.random() * 1000)}`;

    const database = await db;
    const newPlayer = new Player(uuid, cleanNickname, avatar);

    await database.update((data) => data.players.push(newPlayer))
    return newPlayer;
  }
}
