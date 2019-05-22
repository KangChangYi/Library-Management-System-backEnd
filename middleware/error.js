
// 捕获超时错误    暂无使用
module.exports = function (err, req, res, next) {
    res.status(500).send('糟糕！服务器出错了')
}