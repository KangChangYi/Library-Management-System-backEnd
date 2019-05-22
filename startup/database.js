const mongoose = require('mongoose'); // 导入 mongodb

module.exports = function dbConnect() {
    // 连接数据库
    mongoose.connect('mongodb://localhost/LibraryManagementSystemDB', { useNewUrlParser: true, useFindAndModify: false })
        .then(() => { console.log('mongodb connecting...'); })
        .catch((err) => { console.log(err.message); });
};
