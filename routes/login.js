const express = require('express');
// 引入 express 框架
const router = express.Router();

const Joi = require('@hapi/joi'); // 引入数据验证类
const bcrypt = require('bcrypt'); // 引入加密密码库

const { User } = require('../models/user'); // 导入 User 模块

// 验证登陆
function validate(data) {
    const rule = {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    };
    return Joi.validate(data, rule);
}

// POST 用户登陆
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send('邮箱或密码格式错误'); }

    const user = await User.findOne({ email: req.body.email });
    if (!user.auditPass) { return res.status(403).send('该账号尚未通过审核'); }
    if (!user) { return res.status(400).send('邮箱或密码错误'); }


    const validatePassWord = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassWord) return res.status(400).send('邮箱或密码错误');

    const token = user.createLoginToken();
    return res.send(token);
});

// 在客户端完成登出

module.exports = router;
