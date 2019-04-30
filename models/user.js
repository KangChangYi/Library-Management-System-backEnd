const Joi = require('@hapi/joi');              // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb
const config = require('config');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    },
    // accountName: { type: String, required: true },
    email: { type: String, required: true },
    passWord: { type: String, required: true },
    nickName: { type: String, default: "新用户" },
    gener: { type: String, default: "男" },
})

// 创建 登陆的 jwt 方法
userSchema.methods.createLoginToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('user', userSchema);

// 验证
function validateUser (data) {
    const rule = {
        role: Joi.string(),
        // accountName: Joi.string().required(),
        email: Joi.string().email(),
        passWord: Joi.string().required(),
        nickName: Joi.string(),
        gener: Joi.string(),
    };
    return Joi.validate(data, rule);
};

module.exports = {
    User,
    validateUser
}
