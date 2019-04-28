const Joi = require('joi');              // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb

const User = mongoose.model('users', new mongoose.Schema({
    roleId: { type: String, required: true },
    userName: { type: String, required: true },
    passWord: { type: String, required: true },
    nickName: String,
    gener: String,
    email: String
}));

// 验证
function validateUser (data) {
    const rule = {
        roleId: Joi.string().required(),
        userName: Joi.string().required(),
        passWord: Joi.string().required(),
        nickName: Joi.string(),
        gener: Joi.string(),
        email: Joi.string(),
    };
    return Joi.validate(data, rule);
};

module.exports = {
    User,
    validateUser
}
