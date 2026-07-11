// Runs each bug from the sample repository so you can see (and
// copy) a real stack trace for testing the incident-triage system.
// Each demo is wrapped so one failure doesn't stop the others.

const { getProfile } = require('./src/controllers/userController');
const { getProductCategory } = require('./src/services/productService');
const { isInStock } = require('./src/services/inventoryService');
const { getMostRecentOrder } = require('./src/services/orderService');
const { connectToDatabase } = require('./src/config');

async function runDemo(label, fn) {
  console.log(`\n--- ${label} ---`);
  try {
    const result = await fn();
    console.log('Result:', result);
  } catch (err) {
    console.error(err.stack);
  }
}

async function main() {
  await runDemo('Bug 1: undefined property access', () => getProfile(999));
  await runDemo('Bug 2: missing null validation', () => getProductCategory('p2'));
  await runDemo('Bug 3: incorrect async handling (expected: true)', () => isInStock('p1'));
  await runDemo('Bug 4: invalid array access', () => getMostRecentOrder(1));
  await runDemo('Bug 5: missing env var validation', () => connectToDatabase());
}

main();