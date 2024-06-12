const jwt = require("jsonwebtoken");
const AccountModel = require("../models/Account");

// Middleware để xác thực token từ cookie
exports.authenticateToken = (req, res, next) => {
  // Lấy token từ cookie
  const token = req.cookies['jwt'];

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  // Xác thực token
  try {
    const decoded = jwt.verify(token, process.env.USERTOKEN);
    req.user = decoded; // Lưu thông tin người dùng đã xác thực vào yêu cầu
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

// Middleware để kiểm tra quyền admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Tìm người dùng theo ID được lưu trong token đã xác thực
    const user = await AccountModel.findById(req.user.id); 

    // Kiểm tra quyền admin của người dùng
    if (user && user.role === 'admin') {
      next(); // Cho phép truy cập nếu người dùng là admin
    } else {
      res.status(403).send({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error.' });
  }
};
