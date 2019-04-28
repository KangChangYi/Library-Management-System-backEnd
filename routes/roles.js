const express = require("express");         // 引入 express 框架
const router = express.Router();
const Joi = require('joi');              // 引入数据验证类
const mongoose = require('mongoose');        // 导入 mongodb

const Role = mongoose.model('roles', new mongoose.Schema({
    roleName: { type: String, required: true }
}))

// const role = new Role({
//     roleName: '学生',
// })


// GET 获取角色列表
// router.get('/', (req, res) => {
//     // const roleNameList = role.map((val, idx) => {
//     //     return val.roleName;
//     // });
//     res.send(role)
// })

module.exports = router;