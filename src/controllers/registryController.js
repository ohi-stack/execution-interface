import {
  createRegistryRecord,
  getRegistryAuditTrail,
  getRegistryRecordByQrvid,
  revokeRegistryRecord,
} from '../services/registryService.js';
import { AppError } from '../utils/appError.js';

export const getRegistryRecord = async (req, res, next) => {
  try {
    const record = await getRegistryRecordByQrvid(req.validatedQrvid);

    if (!record) {
      throw new AppError(404, 'REGISTRY_RECORD_NOT_FOUND', 'Registry record was not found.');
    }

    res.status(200).json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const createRegistryRecordHandler = async (req, res, next) => {
  try {
    const record = await createRegistryRecord(req.validatedBody);
    res.status(201).json({ data: record });
  } catch (error) {
    next(error);
  }
};

export const revokeRegistryRecordHandler = async (req, res, next) => {
  try {
    const record = await revokeRegistryRecord(req.validatedQrvid, req.validatedBody.actionActor);
    res.status(200).json({
      data: record,
      meta: {
        message: 'Registry record revoked.',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRegistryAuditHandler = async (req, res, next) => {
  try {
    const auditEntries = await getRegistryAuditTrail(req.validatedQrvid);
    res.status(200).json({
      data: {
        qrvid: req.validatedQrvid,
        entries: auditEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};
