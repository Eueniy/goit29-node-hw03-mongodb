const bcryptjs = require("bcryptjs");
const costFactor = 4;
const userModel = require("./user.schema");

async function hashPassword(password) {
  return await bcryptjs.hash(password, costFactor);
}

async function findUserByEmail(email) {
  return await userModel.findOne({ email });
}

async function updateToken(id, newToken) {
  return await userModel.findByIdAndUpdate(id, { token: newToken });
}

module.exports = {
  hashPassword,
  findUserByEmail,
  updateToken,
};
