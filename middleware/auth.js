const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            message: 'Access denied No token provided'
        });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
            });
        }
    };

    module.exports = auth;