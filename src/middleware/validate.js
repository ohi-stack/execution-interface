import { AppError } from '../utils/appError.js';

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const coerceString = (value) => (typeof value === 'string' ? value.trim() : '');

const optionalString = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return typeof value === 'string' ? value.trim() : value;
};

export const validateCreateIssuerPayload = (req, _res, next) => {
  const body = req.body ?? {};
  const issuerName = coerceString(body.issuerName);

  if (!issuerName) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'issuerName is required.'));
  }

  req.validatedBody = {
    issuerName,
    issuerCode: optionalString(body.issuerCode),
    issuerStatus: optionalString(body.issuerStatus) ?? 'active',
    websiteUrl: optionalString(body.websiteUrl),
    contactEmail: optionalString(body.contactEmail),
    actionActor: optionalString(body.actionActor) ?? 'system',
  };

  return next();
};

export const validateCreateRegistryPayload = (req, _res, next) => {
  const body = req.body ?? {};
  const recordType = coerceString(body.recordType);

  if (!recordType) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'recordType is required.'));
  }

  if (!isPlainObject(body.metadata ?? {})) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'metadata must be a JSON object when provided.'));
  }

  if (body.certificate !== undefined && !isPlainObject(body.certificate)) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'certificate must be a JSON object when provided.'));
  }

  req.validatedBody = {
    recordType,
    objectStatus: optionalString(body.objectStatus) ?? 'active',
    issuerId: optionalString(body.issuerId),
    subjectName: optionalString(body.subjectName),
    assetName: optionalString(body.assetName),
    description: optionalString(body.description),
    metadata: body.metadata ?? {},
    actionActor: optionalString(body.actionActor) ?? 'system',
    certificate: body.certificate
      ? {
          certificateNumber: optionalString(body.certificate.certificateNumber),
          issuedTo: optionalString(body.certificate.issuedTo),
          issuedDate: optionalString(body.certificate.issuedDate),
          expiryDate: optionalString(body.certificate.expiryDate),
          metadata: isPlainObject(body.certificate.metadata ?? {}) ? body.certificate.metadata ?? {} : {},
        }
      : null,
  };

  return next();
};

export const validateQrvidParam = (req, _res, next) => {
  const qrvid = coerceString(req.params.qrvid);

  if (!qrvid) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'qrvid parameter is required.'));
  }

  req.validatedQrvid = qrvid;
  return next();
};

export const validateIssuerIdParam = (req, _res, next) => {
  const issuerId = coerceString(req.params.id);

  if (!issuerId) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'Issuer id parameter is required.'));
  }

  req.validatedIssuerId = issuerId;
  return next();
};

export const validateRevokePayload = (req, _res, next) => {
  const body = req.body ?? {};
  req.validatedBody = {
    actionActor: optionalString(body.actionActor) ?? 'system',
  };
  return next();
};
