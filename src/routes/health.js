import express from 'express';
import { checkDatabase } from '../db/postgres.js';

const router = express.Router();

router.get('/ready', async (req, res) => {
  const db = await checkDatabase();

  res.json({
    ok: db.ok ?? true,
    database: db,
    timekeeping: 'OTS-V5'
  });
});

export default router;
