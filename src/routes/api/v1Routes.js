import { Router } from 'express';
import {
  getHistoricalEventById,
  getHistoricalEvents,
  getVerifyRecord,
  postHistoricalEvent,
  postMigrateHistoricalEvent,
  postRecord,
  postRevokeRecord,
} from '../../controllers/api/v1Controller.js';
import { validateBody } from '../../middleware/validateSchema.js';
import { enforcePolicy } from '../../services/policyService.js';

const router = Router();

router.post('/records', enforcePolicy('create_record'), validateBody('createRecord'), postRecord);
router.get('/verify/:qrvid', getVerifyRecord);
router.post('/records/:qrvid/revoke', enforcePolicy('revoke_record'), validateBody('revokeRecord'), postRevokeRecord);
router.post('/history/events', validateBody('historicalEventCreate'), postHistoricalEvent);
router.post('/history/events/migrate', validateBody('historicalEventMigration'), postMigrateHistoricalEvent);
router.get('/history/events', getHistoricalEvents);
router.get('/history/events/:event_id', getHistoricalEventById);

export default router;
