import { JSONFilePreset } from 'lowdb/node';
import type { Player } from '../models/Player';
import { fileURLToPath } from 'url';

interface Database {
  players: Player[]
}

const db = JSONFilePreset<Database>('./db/db.json', {
  players: [],
});

export default db;
