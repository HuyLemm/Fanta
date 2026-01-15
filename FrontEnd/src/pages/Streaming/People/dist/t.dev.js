"use strict";

var getCastAndDirectorImages = function getCastAndDirectorImages(cast, director) {
  var response, data;
  return regeneratorRuntime.async(function getCastAndDirectorImages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('https://fanta-kappa.vercel.app/public/get-cast-and-director-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(token)
            },
            body: JSON.stringify({
              cast: cast,
              director: director
            })
          }));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error("Error: ".concat(response.status, " ").concat(response.statusText));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          setCastImages(data.castImages);
          setDirectorImages(data.directorImages);
          console.log('Fetched cast and director images:', data);
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.log('Fetch images error:', _context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};