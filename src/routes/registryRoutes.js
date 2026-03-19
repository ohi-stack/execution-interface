import { Router } from 'express';
import {
  createRegistryRecordHandler,
  getRegistryAuditHandler,
  getRegistryRecord,
  revokeRegistryRecordHandler,
} from '../controllers/registryController.js';
import { createIssuerHandler, getIssuerHandler } from '../controllers/issuerController.js';
import {
  validateCreateIssuerPayload,
  validateCreateRegistryPayload,
  validateIssuerIdParam,
  validateQrvidParam,
  validateRevokePayload,
} from '../middleware/validate.js';

const router = Router();

router.get('/registry/:qrvid', validateQrvidParam, getRegistryRecord);
router.post('/registry/create', validateCreateRegistryPayload, createRegistryRecordHandler);
router.post('/registry/issuer/create', validateCreateIssuerPayload, createIssuerHandler);
router.get('/registry/issuers/:id', validateIssuerIdParam, getIssuerHandler);
router.post('/registry/:qrvid/revoke', validateQrvidParam, validateRevokePayload, revokeRegistryRecordHandler);
router.get('/registry/:qrvid/audit', validateQrvidParam, getRegistryAuditHandler);

export default router;
