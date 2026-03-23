export const validateIssuePayload = (payload) => {
  const requiredFields = ['assetName', 'recordType', 'issuer', 'description'];
  const missingField = requiredFields.find((field) => !payload[field] || !String(payload[field]).trim());

  if (missingField) {
    return `Missing required field: ${missingField}`;
  }

  return '';
};
