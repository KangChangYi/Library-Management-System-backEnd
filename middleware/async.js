
// 用于捕获路由执行时发生的错误     暂无使用
module.exports = function asyncMiddleware(handle) {
    return (req, res, next) => {
        try {
            handle(req, res);
        } catch (error) {
            console.log('捕获了错误');
            next(error);
        }
    };
};
