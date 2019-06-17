// const debug = require('debug')("startup");  // debugger  取代 console.log
const express = require('express');

const app = express();// 引入 express 框架

// const morgan = require('morgan');           // 进行http请求的日志记录

// if (app.get("env") === 'development') {
//     app.use(morgan('tiny'));
//     debug('morgan...');
// };

require('./startup/config')(); // config 细节
require('./startup/database')(); // 数据库细节
require('./startup/routes')(app); // 路由细节 和 中间件细节

app.listen(3000, () => {
    console.log('listening 3000 port now');
});
