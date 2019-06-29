// 用于验证某些特定操作的操作者是否是管理员
module.exports = function isAdmin(req, res, next) {
    if (req.user.role !== '5cc5842d8fdf583b48486b02') { // 管理员的 Object id
        return res.status(403).send('仅管理员可操作');
    }
    return next();
};
