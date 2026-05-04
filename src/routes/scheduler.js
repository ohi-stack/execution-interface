const express = require('express');
const { listEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../storage/scheduler-store');
const { toOnegodianDate, formatOnegodianDate, getDayOrder, ENV } = require('./calendar');
const router = express.Router();
function ensureEnabled(res) { if (!ENV.ENABLE_SCHEDULER) { res.status(503).json({ error: 'scheduler_disabled' }); return false; } return true; }
function enrich(e) { const date = new Date(e.timestamp_utc); const gregorianDate = date.toISOString().slice(0, 10); return { ...e, gregorianDate, ot: { ...toOnegodianDate(date), display: formatOnegodianDate(date) }, dayOrder: getDayOrder(date), checkoutReady: !!process.env.STRIPE_SECRET_KEY, checkoutProvider: process.env.STRIPE_SECRET_KEY ? 'stripe_configured' : 'mock' }; }
router.get('/status', (_req, res) => { if (!ensureEnabled(res)) return; res.json({ ok: true, scheduler: 'enabled', persistence: 'memory', timekeeping: ENV.OT_STANDARD }); });
router.get('/events', (req, res) => { if (!ensureEnabled(res)) return; res.json(listEvents(req.query).map(enrich)); });
router.get('/events/:id', (req, res) => { if (!ensureEnabled(res)) return; const event = getEvent(req.params.id); if (!event) return res.status(404).json({ error: 'not_found' }); return res.json(enrich(event)); });
router.post('/events', (req, res) => { if (!ensureEnabled(res)) return; const data = req.body || {}; if (!data.title || !data.timestamp_utc) return res.status(400).json({ error: 'invalid_payload' }); return res.status(201).json(enrich(createEvent(data))); });
router.put('/events/:id', (req, res) => { if (!ensureEnabled(res)) return; const updated = updateEvent(req.params.id, req.body || {}); if (!updated) return res.status(404).json({ error: 'not_found' }); return res.json(enrich(updated)); });
router.delete('/events/:id', (req, res) => { if (!ensureEnabled(res)) return; deleteEvent(req.params.id); res.json({ deleted: true }); });
module.exports = router;
