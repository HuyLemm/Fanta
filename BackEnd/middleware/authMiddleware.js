const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try{
        var token = req.cookies.token;
        var result = jwt.verify(token, process.env.SESSION_SECRET);
        if (result) {
            next();
        }
    } catch (err) {
        res.status(401).json('You need to login');
    }
};

module.exports = authenticateToken;
