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

module.exports = router;
