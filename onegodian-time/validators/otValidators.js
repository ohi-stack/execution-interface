export const validateOtInput = ({ year, dayOfYear }) => {
  if (!Number.isInteger(year) || year < 0) throw new Error('Invalid year');
  if (!Number.isInteger(dayOfYear) || dayOfYear < 1) throw new Error('Invalid dayOfYear');
};
