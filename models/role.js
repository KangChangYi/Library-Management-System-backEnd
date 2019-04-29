const Joi = require('@hapi/joi');            // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb

const Role = mongoose.model('role', new mongoose.Schema({
    roleName: { type: String, required: true }
}));

module.exports = Role