// Simulates an order history lookup.

const orders = {
  1: [
    { id: 'ord_1', total: 42.5 },
    { id: 'ord_2', total: 18.0 },
    { id: 'ord_3', total: 65.25 },
  ],
};

function getOrdersForUser(userId) {
  return orders[userId] || [];
}

// BUG: off-by-one. Valid indices for a 3-item array are 0-2, but
// this reads index `length` (3), one past the end — always
// undefined — instead of `length - 1` for the actual last order.
function getMostRecentOrder(userId) {
  const userOrders = getOrdersForUser(userId);
  return userOrders[userOrders.length].total;
}

module.exports = { getOrdersForUser, getMostRecentOrder };