"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.checkLoginStatus = void 0;

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

var checkLoginStatus = function checkLoginStatus() {
  var token, response, data;
  return regeneratorRuntime.async(function checkLoginStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = getCookie('jwt');

          if (token) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", {
            loggedIn: false,
            role: null,
            avatar: null
          });

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch('https://fanta-kappa.vercel.app/public/check-role', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(token)
            }
          }));

        case 6:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 14;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          data = _context.sent;
          return _context.abrupt("return", {
            loggedIn: true,
            role: data.role,
            avatar: data.avatar
          });

        case 14:
          if (response.status !== 401) {
            console.error('Failed to check login status:', response.statusText);
          }

          return _context.abrupt("return", {
            loggedIn: false,
            role: null,
            avatar: null
          });

        case 16:
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error('Error checking login status:', _context.t0);
          return _context.abrupt("return", {
            loggedIn: false,
            role: null,
            avatar: null
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.checkLoginStatus = checkLoginStatus;