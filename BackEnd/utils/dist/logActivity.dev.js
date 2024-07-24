"use strict";

var ActivityModel = require('../models/Activity');

var logActivity = function logActivity(userId, movieId, action, details) {
  var newLog;
  return regeneratorRuntime.async(function logActivity$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          newLog = new ActivityModel({
            userId: userId,
            movieId: movieId,
            action: action,
            details: details
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(newLog.save());

        case 4:
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error('Error logging activity:', _context.t0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = logActivity;