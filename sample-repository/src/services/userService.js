// Simulates fetching users from a database.
// A real app would query Postgres/Mongo here; an in-memory
// array keeps this sample repo dependency-free.

const users = [
  { id: 1, name: 'Asha Menon', email: 'asha@example.com' },
  { id: 2, name: 'Rahul Nair', email: 'rahul@example.com' },
];

function findUserById(id) {
  return users.find((u) => u.id === id);
}

// BUG: no check that findUserById actually found someone.
// Call with an id that doesn't exist (e.g. 999) and this throws
// "Cannot read properties of undefined (reading 'name')".
function getUserProfile(id) {
  const user = findUserById(id);
  return user.name;
}

module.exports = { getUserProfile, findUserById };