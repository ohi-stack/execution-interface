import { Router } from 'express';
import {
  getAuthorityModel,
  getDecisionById,
  getDecisions,
  getKillSwitch,
  postAuthorize,
  postKillSwitchAgent,
  postKillSwitchDomain,
  postKillSwitchGlobal,
} from '../../controllers/api/authorityController.js';

const router = Router();

router.get('/authority/model', getAuthorityModel);
router.post('/authorize', postAuthorize);
router.get('/decisions/:decisionId', getDecisionById);
router.get('/decisions', getDecisions);

router.get('/kill-switch', getKillSwitch);
router.post('/kill-switch/global', postKillSwitchGlobal);
router.post('/kill-switch/domain/:domain', postKillSwitchDomain);
router.post('/kill-switch/agent/:agentId', postKillSwitchAgent);

export default router;
