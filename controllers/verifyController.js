import { verifyRecord as verifyRecordByQrvid } from '../services/registryService.js';
import { computeQvr1Integrity } from '../utils/crypto.js';
import { normalizeQRVID, validateQRVID } from '../utils/qrvid.js';

const mapStatus = (result) => {
  if (!result?.record) {
    return 'not_found';
  }

  if (result.record.status === 'revoked') {
    return 'revoked';
  }

  if (!result.record.integrityValid) {
    return 'invalid';
  }

  return 'valid';
};

const mapProtocolRecord = (record) => {
  if (!record) {
    return null;
  }

  return {
    type: record.recordType,
    assetName: record.assetName,
    recipientName: record.recipientName,
    description: record.description,
    metadata: record.metadata,
    status: record.status,
    verifyUrl: record.verifyUrl,
    revokedReason: record.revokedReason,
  };
};

const mapIssuer = (record, normalizedQrvid) => ({
  id: record?.issuerId || null,
  name: record?.issuerName || null,
  namespace: record?.registryNamespace || normalizedQrvid?.namespace || null,
});

const mapTimestamps = (record) => ({
  createdAt: record?.createdAt || null,
  updatedAt: record?.updatedAt || null,
  revokedAt: record?.revokedAt || null,
  verifiedAt: new Date().toISOString(),
});

const mapIntegrity = (record) => {
  if (!record) {
    return {
      hash: null,
      signature: null,
      algorithm: 'sha256',
      version: 'QVR-1',
    };
  }

  const integrity = computeQvr1Integrity(record);
  return {
    hash: integrity.hash,
    signature: integrity.signature,
    algorithm: integrity.algorithm,
    version: integrity.version,
  };
};

export async function verifyRecord(req, res, next) {
  try {
    const { qrvid: paramQrvid } = req.params ?? {};
    const { qrvid: bodyQrvid } = req.body ?? {};
    const rawQrvid = typeof paramQrvid === 'string'
      ? paramQrvid.trim()
      : typeof bodyQrvid === 'string'
        ? bodyQrvid.trim()
        : '';

    if (!rawQrvid) {
      return res.status(400).json({ error: 'qrvid is required.' });
    }

    if (!validateQRVID(rawQrvid)) {
      return res.status(400).json({ error: 'Invalid qrvid format.' });
    }

    const normalizedQrvid = normalizeQRVID(rawQrvid);
    const result = await verifyRecordByQrvid(normalizedQrvid);
    const record = result?.record || null;
    const response = {
      status: mapStatus(result),
      qrvid: {
        compact: record?.qrvidCompact || normalizedQrvid?.compact || null,
        protocol: record?.qrvidProtocol || normalizedQrvid?.protocol || null,
      },
      record: mapProtocolRecord(record),
      issuer: mapIssuer(record, normalizedQrvid),
      timestamps: mapTimestamps(record),
      integrity: mapIntegrity(record),
    };

    if (!record) {
      return res.status(404).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}
