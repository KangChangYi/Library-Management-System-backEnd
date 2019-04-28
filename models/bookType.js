const Joi = require('joi');                 // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb

const BookType = mongoose.model('bookTypes', new mongoose.Schema({
    typeId: { type: String, $inc: { count: 1 } },
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