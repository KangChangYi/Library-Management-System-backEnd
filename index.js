const debug = require('debug')("startup");  // debugger  取代 console.log 
const Joi = require('joi');                 // 引入数据验证类
const express = require('express');         // 引入 express 框架
const helmet = require('helmet');           // 帮助我们通过设置http头部增加安全性
// const config = require('config');           // 不同环境下的配置
// const morgan = require('morgan');           // 进行http请求的日志记录
const logger = require('./middleware/logger');         // 自定义中间件
const authenticating = require('./middleware/authenticating');   // 自定义中间件
const bookTypes = require("./routes/bookTypes");   // 导入 bookType 路由
const users = require("./routes/users");   // 导入 user 路由
const roles = require('./routes/roles');          // 导入 role 路由
const mongoose = require('mongoose');        // 导入 mongodb

// 连接数据库
mongoose.connect('mongodb://localhost/LibraryManagementSystemDB', { useNewUrlParser: true, useFindAndModify: false })
    .then(res => { console.log("mongodb connecting...") })
    .catch(err => { console.log(err.message) })





const app = express();      // 赋值 express 的顶级函数
// debug(`NODE_ENV:${process.env.NODE_ENV}`);
// debug(`${app.get('env')}`);

app.use(helmet());
// if (app.get("env") === 'development') {
//     app.use(morgan('tiny'));
//     debug('morgan...');
// };

// 使用中间件
app.use(express.json());        // 格式化请求体，符合Json格式就设置好req.body
app.use(express.urlencoded({ extended: true }));  // 请求体格式，符合key=value&key=value  就设置好req.body
app.use(express.static('public'));      // 允许读取静态内容文件夹
app.use(logger);
app.use(authenticating);

app.use('/api/bookType', bookTypes);  //  以 /api/bookType 开头的路由使用 bookType 路由处理
app.use('/api/role', roles);
app.use('/api/user', users);

// debug("name:", config.get('name'));

app.listen(3000, () => {
    debug('listening 3000 port now')
})
