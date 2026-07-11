// Simulates checking stock via a remote warehouse API.
// setTimeout stands in for a real network call.

function fetchStockCount(sku) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sku === 'p1' ? 14 : 0), 50);
  });
}

// BUG: forgets to `await` the promise, so `stock` is a pending
// Promise object, not a number. Comparing a Promise with `> 0`
// is always false, so this reports items as out of stock even
// when plenty are available.
async function isInStock(sku) {
  const stock = fetchStockCount(sku);
  return stock > 0;
}

module.exports = { fetchStockCount, isInStock };