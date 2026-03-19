import { query, withTransaction } from '../db/pool.js';
import { insertAuditLog } from '../models/auditModel.js';
import { findIssuerById, insertIssuer } from '../models/issuerModel.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/appError.js';
import { generateUuid } from '../utils/qrvid.js';

const toIso = (value) => (value instanceof Date ? value.toISOString() : value);

const mapIssuer = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    issuerName: row.issuer_name,
    issuerCode: row.issuer_code,
    issuerStatus: row.issuer_status,
    websiteUrl: row.website_url,
    contactEmail: row.contact_email,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
};

export const createIssuer = async (payload) => {
  return withTransaction(async (client) => {
    const issuer = await insertIssuer(client, {
      id: generateUuid(),
      issuerName: payload.issuerName,
      issuerCode: payload.issuerCode ?? null,
      issuerStatus: payload.issuerStatus ?? 'active',
      websiteUrl: payload.websiteUrl ?? null,
      contactEmail: payload.contactEmail ?? null,
    });

    await insertAuditLog(client, {
      id: generateUuid(),
      qrObjectId: null,
      actionType: 'issuer_created',
      actionActor: payload.actionActor ?? 'system',
      actionDetails: {
        issuerId: issuer.id,
        issuerCode: issuer.issuer_code,
      },
    });

    logger.info('Created issuer registry entry.', { issuerId: issuer.id, issuerCode: issuer.issuer_code });
    return mapIssuer(issuer);
  });
};

export const getIssuerById = async (issuerId) => {
  const issuer = await findIssuerById({ query }, issuerId);

  if (!issuer) {
    throw new AppError(404, 'ISSUER_NOT_FOUND', 'Issuer was not found.');
  }

  return mapIssuer(issuer);
};
