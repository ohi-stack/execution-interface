import { verifyQRVID } from '../services/verificationService.js';
import { sanitizeQRVID } from '../utils/qrvid.js';
import { renderIndexView } from '../views/indexView.js';
import { renderResultView } from '../views/resultView.js';

const basePageModel = {
  pageTitle: 'QR-V™ Verification',
  errorSummary: null,
};

export const renderLandingPage = (_req, res) => {
  res.status(200).send(renderIndexView({
    ...basePageModel,
    qrvid: '',
  }));
};

export const submitVerificationRequest = (req, res) => {
  const qrvid = sanitizeQRVID(req.body?.qrvid || req.query?.qrvid || '');

  if (!qrvid) {
    return res.redirect('/');
  }

  return res.redirect(`/verify/${encodeURIComponent(qrvid)}`);
};

export const renderVerificationResult = async (req, res) => {
  const requestedQRVID = req.params.qrvid;
  const result = await verifyQRVID(requestedQRVID);

  const statusCode = result.verification.status === 'VERIFIED'
    ? 200
    : result.verification.status === 'NOT_FOUND'
      ? 404
      : result.verification.status === 'UNAVAILABLE'
        ? 503
        : 200;

  return res.status(statusCode).send(renderResultView({
    ...basePageModel,
    qrvid: result.qrvid || sanitizeQRVID(requestedQRVID) || requestedQRVID,
    verification: result.verification,
    errorSummary: result.ok ? null : result.error,
    autoVerify: true,
  }));
};
