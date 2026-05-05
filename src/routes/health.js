import express from 'express';
import { checkDatabase } from '../db/postgres.js';
const express = require('express');
const { checkDatabase } = require('../db/postgres');

const router = express.Router();

router.get('/ready', async (_req, res) => {
  const db = await checkDatabase();

  res.json({
    ok: db.ok ?? true,
    database: db,
    timekeeping: 'OTS-V5'
  });
});

export default router;
module.exports = router;
