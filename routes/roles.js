const express = require("express");         // 引入 express 框架
const router = express.Router();

const Role = require('../models/role');

// GET 获取角色列表
router.get('/', async (req, res) => {
    const roleList = await Role.find();
    res.send(roleList)
});

module.exports = router;