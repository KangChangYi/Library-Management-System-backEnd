const jwt = require('jsonwebtoken');
// const config = require("config");

// 用于验证是否在需要 jwt 的操作中携带 jwt
module.exports = function authenticating(req, res, next) {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).send('没有 token');
    }
    try { // config.get('jwtPrivateKey')
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send('非法 token');
    }
    return true;
};
