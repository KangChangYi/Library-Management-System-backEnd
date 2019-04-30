const Joi = require('@hapi/joi');               // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb

const BookType = mongoose.model('bookType', new mongoose.Schema({
    typeName: { type: String, required: true }
}));

// 验证
function validateBookType (data) {
    const rule = {
        typeName: Joi.string().required()
    };
    return Joi.validate(data, rule);
};

module.exports = {
    BookType,
    validateBookType
}