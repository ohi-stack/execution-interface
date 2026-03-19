import { generateRecordId } from '../utils/idGenerator.js';

const registry = {};

export const createRecord = ({ assetName, issuer, description }) => {
  const id = generateRecordId();
  const record = {
    id,
    assetName,
    issuer,
    description,
    status: 'valid',
    createdAt: new Date().toISOString(),
  };

  registry[id] = record;
  return record;
};

export const getRecordById = (id) => registry[id] ?? null;

export const getRegistrySnapshot = () => ({ ...registry });
