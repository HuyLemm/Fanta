  const jwt = require("jsonwebtoken");

  exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    if (!token) {
      return res.status(401).json('Access Denied');
    }

    try {
      const verified = jwt.verify(token, process.env.SESSION_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json('Invalid Token');
    }
  };

  // Middleware để kiểm tra xem người dùng có vai trò là user hay không
  exports.isUser = (req, res, next) => {
    exports.authenticateToken(req, res, () => {
      if (req.user.role === 'user') {
        next();
      } else {
        res.status(403).json('Access Denied: Requires User Role');
      }
    });
  };

  // Middleware để kiểm tra xem người dùng có vai trò là admin hay không
  exports.isAdmin = (req, res, next) => {
    exports.authenticateToken(req, res, () => {
      if (req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json('Access Denied: Requires Admin Role');
      }
    });
  };
