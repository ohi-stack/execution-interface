const { generateApiKey, hashApiKey } = require('../src/runtime/keys');

const key = generateApiKey();
const hash = hashApiKey(key);

console.log('API KEY:', key);
console.log('STORE HASH:', hash);
