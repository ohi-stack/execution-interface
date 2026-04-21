import { Router } from 'express';
import { postIssueCertificate, postIssuerRevoke, renderIssuerConsole } from '../controllers/issuerController.js';
import { requireJwtAuth } from '../middleware/jwtAuth.js';

const router = Router();

router.get('/', renderIssuerConsole);
router.post('/issue', requireJwtAuth(['issuer', 'admin']), postIssueCertificate);
router.post('/revoke', requireJwtAuth(['admin']), postIssuerRevoke);

export default router;
