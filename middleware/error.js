
// 捕获超时错误    暂无使用
module.exports = function serverError(err, req, res) {
    return res.status(500).send('糟糕！服务器出错了');
};
