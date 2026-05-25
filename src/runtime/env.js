const required = ['OMOS_API_KEY'];
required.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env: ${key}`);
});
module.exports = { required };
