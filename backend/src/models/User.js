const bcrypt = require("bcryptjs");

// In-memory user store — swap with a real DB (Mongoose/Prisma) later
// by replacing these functions with DB calls. The interface stays the same.
const users = [];

const findByEmail = (email) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;

const findById = (id) => users.find((u) => u.id === id) || null;

const create = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    id:           Date.now().toString(),
    name,
    email:        email.toLowerCase(),
    passwordHash,
    createdAt:    new Date().toISOString(),
  };
  users.push(user);
  return user;
};

const verifyPassword = async (plainText, hash) =>
  bcrypt.compare(plainText, hash);

// Never expose passwordHash to the client
const sanitize = (user) => ({
  id:        user.id,
  name:      user.name,
  email:     user.email,
  createdAt: user.createdAt,
});

module.exports = { findByEmail, findById, create, verifyPassword, sanitize };