const express = require('express'); // 引入 express 框架
const helmet = require('helmet'); // 帮助我们通过设置http头部增加安全性
// 导入 路由
const users = require('../routes/users');
const roles = require('../routes/roles');
const bookInfos = require('../routes/bookInfos');
const bookTypes = require('../routes/bookTypes');
const login = require('../routes/login');
const borrows = require('../routes/borrows');

module.exports = function routes(app) {
    // 使用中间件
    app.use(helmet());
    app.use(express.json({ limit: '50mb' })); // 格式化请求体，符合Json格式就设置好req.body
    app.use(express.urlencoded({ limit: '50mb', extended: true })); // 请求体格式，符合key=value&key=value  就设置好req.body

    // app.use(express.static('public'));      // 允许读取静态内容文件夹
    // CORS跨域
    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'DELETE,PUT');
        res.header('Access-Control-Allow-Headers', 'Content-Type,x-token');
        next();
    });

    //  以 /api/bookType 开头的路由使用 bookType 路由处理
    app.use('/api/bookInfo', bookInfos);
    app.use('/api/bookType', bookTypes);
    app.use('/api/borrow', borrows);
    app.use('/api/role', roles);
    app.use('/api/user', users);
    app.use('/api/login', login);
};
