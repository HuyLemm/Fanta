// tokenStore.js
const tokenStore = new Set();

module.exports = {
  addToken: (token) => {
    tokenStore.add(token);
  },
  removeToken: (token) => {
    tokenStore.delete(token);
  },
  hasToken: (token) => {
    return tokenStore.has(token);
  },
  getAllTokens: () => {
    return Array.from(tokenStore);
  }
};

