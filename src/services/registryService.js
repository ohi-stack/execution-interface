import { query, withTransaction } from '../db/pool.js';
import { insertAuditLog, findAuditLogsByQrvid } from '../models/auditModel.js';
import {
  findRegistryRecordByQrvid,
  insertCertificate,
  insertHashRecord,
  insertQrObject,
  updateRegistryStatusByQrvid,
} from '../models/registryModel.js';
import { findIssuerById } from '../models/issuerModel.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/appError.js';
import { createSha256Hash, toCanonicalJson } from '../utils/hash.js';
import { generateQrvid, generateUuid } from '../utils/qrvid.js';

const toIso = (value) => (value instanceof Date ? value.toISOString() : value);

const mapIssuer = (row) => {
  if (!row?.issuer_id) {
    return null;
  }

  return {
    id: row.issuer_id,
    issuerName: row.issuer_name,
    issuerCode: row.issuer_code,
    issuerStatus: row.issuer_status,
    websiteUrl: row.website_url,
    contactEmail: row.contact_email,
  };
};

const mapCertificate = (row) => {
  if (!row?.certificate_id) {
    return null;
  }

  return {
    id: row.certificate_id,
    certificateNumber: row.certificate_number,
    issuedTo: row.issued_to,
    issuedDate: row.issued_date,
    expiryDate: row.expiry_date,
    metadata: row.metadata ?? {},
  };
};

const mapRegistryRecord = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    qrvid: row.qrvid,
    recordType: row.record_type,
    objectStatus: row.object_status,
    subjectName: row.subject_name,
    assetName: row.asset_name,
    description: row.description,
    hash: {
      algorithm: row.hash_algorithm ?? 'SHA-256',
      value: row.hash_value,
      status: row.hash_status ?? 'valid',
      recordedAt: toIso(row.hash_created_at ?? row.created_at),
    },
    issuer: mapIssuer(row),
    certificate: mapCertificate(row),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
};

const mapAuditEntry = (row) => ({
  id: row.id,
  qrObjectId: row.qr_object_id,
  actionType: row.action_type,
  actionActor: row.action_actor,
  actionDetails: row.action_details ?? {},
  createdAt: toIso(row.created_at),
});

export const createRegistryRecord = async (payload) => {
  return withTransaction(async (client) => {
    if (payload.issuerId) {
      const issuer = await findIssuerById(client, payload.issuerId);
      if (!issuer) {
        throw new AppError(404, 'ISSUER_NOT_FOUND', 'Issuer does not exist for the supplied issuerId.');
      }
    }

    const qrvid = generateQrvid();
    const canonicalPayload = toCanonicalJson({
      qrvid,
      recordType: payload.recordType,
      issuerId: payload.issuerId ?? null,
      subjectName: payload.subjectName ?? null,
      assetName: payload.assetName ?? null,
      description: payload.description ?? null,
      certificate: payload.certificate ?? null,
      metadata: payload.metadata ?? {},
    });
    const hashValue = createSha256Hash(canonicalPayload);

    const objectRecord = await insertQrObject(client, {
      id: generateUuid(),
      qrvid,
      recordType: payload.recordType,
      objectStatus: payload.objectStatus ?? 'active',
      issuerId: payload.issuerId ?? null,
      subjectName: payload.subjectName ?? null,
      assetName: payload.assetName ?? null,
      description: payload.description ?? null,
      hashValue,
    });

    await insertHashRecord(client, {
      id: generateUuid(),
      qrObjectId: objectRecord.id,
      hashAlgorithm: 'SHA-256',
      hashValue,
      hashStatus: 'valid',
    });

    if (payload.certificate) {
      await insertCertificate(client, {
        id: generateUuid(),
        qrObjectId: objectRecord.id,
        certificateNumber: payload.certificate.certificateNumber ?? null,
        issuedTo: payload.certificate.issuedTo ?? null,
        issuedDate: payload.certificate.issuedDate ?? null,
        expiryDate: payload.certificate.expiryDate ?? null,
        metadata: payload.certificate.metadata ?? payload.metadata ?? {},
      });
    }

    await insertAuditLog(client, {
      id: generateUuid(),
      qrObjectId: objectRecord.id,
      actionType: 'record_created',
      actionActor: payload.actionActor ?? 'system',
      actionDetails: {
        qrvid,
        recordType: payload.recordType,
        objectStatus: objectRecord.object_status,
      },
    });

    const storedRecord = await findRegistryRecordByQrvid(client, qrvid);
    logger.info('Created canonical registry record.', { qrvid, recordType: payload.recordType });
    return mapRegistryRecord(storedRecord);
  });
};

export const getRegistryRecordByQrvid = async (qrvid) => {
  const row = await findRegistryRecordByQrvid({ query }, qrvid);
  return mapRegistryRecord(row);
};

export const revokeRegistryRecord = async (qrvid, actionActor = 'system') => {
  return withTransaction(async (client) => {
    const updatedRecord = await updateRegistryStatusByQrvid(client, qrvid, 'revoked');

    if (!updatedRecord) {
      throw new AppError(404, 'REGISTRY_RECORD_NOT_FOUND', 'Registry record was not found.');
    }

    await insertAuditLog(client, {
      id: generateUuid(),
      qrObjectId: updatedRecord.id,
      actionType: 'record_revoked',
      actionActor,
      actionDetails: {
        qrvid,
        updatedStatus: 'revoked',
      },
    });

    const storedRecord = await findRegistryRecordByQrvid(client, qrvid);
    logger.warn('Revoked canonical registry record.', { qrvid, actionActor });
    return mapRegistryRecord(storedRecord);
  });
};

export const getRegistryAuditTrail = async (qrvid) => {
  const logs = await findAuditLogsByQrvid({ query }, qrvid);
  return logs.map(mapAuditEntry);
};
