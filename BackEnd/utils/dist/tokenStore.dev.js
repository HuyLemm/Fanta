"use strict";

// tokenStore.js
var tokenStore = new Set();
module.exports = {
  addToken: function addToken(token) {
    tokenStore.add(token);
  },
  removeToken: function removeToken(token) {
    tokenStore["delete"](token);
  },
  hasToken: function hasToken(token) {
    return tokenStore.has(token);
  },
  getAllTokens: function getAllTokens() {
    return Array.from(tokenStore);
  }
};