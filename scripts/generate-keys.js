// Script to generate API keys for all editors
// Run this locally to get the keys, then update the database

const crypto = require('crypto');

const editors = [
  // Aurapets editors
  { name: 'James', brand: 'aurapets', prefix: 'ap' },
  { name: 'John', brand: 'aurapets', prefix: 'ap' },
  { name: 'Antoni', brand: 'aurapets', prefix: 'ap' },
  { name: 'Daniel', brand: 'aurapets', prefix: 'ap' },
  { name: 'Eyasu', brand: 'aurapets', prefix: 'ap' },
  { name: 'Eugene', brand: 'aurapets', prefix: 'ap' },
  // LuminEye editors
  { name: 'Santanu', brand: 'lumineye', prefix: 'le' },
  { name: 'Daniel2', brand: 'lumineye', prefix: 'le' },
];

function generateKey(prefix, name) {
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${name.toLowerCase()}_${randomPart}`;
}

console.log('\n=== EDITOR API KEYS ===\n');
console.log('Copy these keys and distribute to each editor.\n');
console.log('─'.repeat(70));

const keys = editors.map(e => {
  const key = generateKey(e.prefix, e.name);
  return { ...e, apiKey: key };
});

// Group by brand
const aurapetsEditors = keys.filter(k => k.brand === 'aurapets');
const lumineyeEditors = keys.filter(k => k.brand === 'lumineye');

console.log('\n📦 AURAPETS EDITORS:\n');
aurapetsEditors.forEach(e => {
  console.log(`  ${e.name}:`);
  console.log(`    API Key: ${e.apiKey}`);
  console.log('');
});

console.log('\n📦 LUMINEYE EDITORS:\n');
lumineyeEditors.forEach(e => {
  console.log(`  ${e.name}:`);
  console.log(`    API Key: ${e.apiKey}`);
  console.log('');
});

console.log('─'.repeat(70));
console.log('\n=== SQL INSERT STATEMENTS ===\n');
console.log('Run these in Supabase SQL Editor:\n');

keys.forEach(e => {
  console.log(`INSERT INTO editors (name, api_key, brand_id) VALUES ('${e.name}', '${e.apiKey}', '${e.brand}');`);
});

console.log('\n');
