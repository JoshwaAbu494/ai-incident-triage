// Simulates a product catalog lookup.

const products = [
  { id: 'p1', name: 'Wireless Mouse', price: 25, metadata: { category: 'Accessories' } },
  { id: 'p2', name: 'Mechanical Keyboard', price: 80 }, // no metadata on this one
];

function findProductById(id) {
  return products.find((p) => p.id === id);
}

// BUG: assumes every product has a metadata object, but not all
// catalog entries do (see p2 above) — missing a null check on
// product.metadata before reading .category.
function getProductCategory(productId) {
  const product = findProductById(productId);
  return product.metadata.category;
}

module.exports = { findProductById, getProductCategory };