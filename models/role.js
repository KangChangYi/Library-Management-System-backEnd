const Joi = require('@hapi/joi'); // 引入数据验证类
const mongoose = require('mongoose'); // 导入 mongodb

const Role = mongoose.model('role', new mongoose.Schema({
    roleName: { type: String, required: true },
    maxLend: { type: Number, required: true },
    maxDate: { type: Number, required: true },
}));

function validateRole(data) {
    const rule = {
        roleName: Joi.string().required(),
        maxLend: Joi.number().required(),
        maxDate: Joi.number().required(),
    };
    return Joi.validate(data, rule);
}
module.exports = {
    Role,
    validateRole,
};
