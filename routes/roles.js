const express = require('express');
// 引入 express 框架
const router = express.Router();

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件
const admin = require('../middleware/admin'); // 导入验证 是否是管理员 中间件

const { Role, validateRole } = require('../models/role');

// GET 获取角色列表
router.get('/', [auth, admin], async (req, res) => {
    try {
        const roleList = await Role.find();
        return res.send(roleList);
    } catch (error) {
        return res.status(500).send('查询角色列表失败');
    }
});

// POST 新增角色
router.post('/', [auth, admin], async (req, res) => {
    try {
        const { error } = validateRole(req.body);
        if (error) {
            return res.status('400').send(error.details[0].message);
        }

        let role = new Role({
            roleName: req.body.roleName,
            maxLend: req.body.maxLend,
            maxDate: req.body.maxDate,
        });

        role = await role.save();
        return res.send(role);
    } catch (error) {
        return res.status(404).send('新增失败');
    }
});

// PUT 更新角色
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const { error } = validateRole(req.body);
        if (error) {
            return res.status('400').send(error.details[0].message);
        }

        const role = await Role.findByIdAndUpdate(req.params.id, {
            roleName: req.body.roleName,
            maxLend: req.body.maxLend,
        }, { new: true });

        return res.send(role);
    } catch (error) {
        return res.send(404).send('未找到对应ID的角色');
    }
});

// DELETE 删除角色
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const role = await Role.findByIdAndRemove(req.params.id);
        return res.send(role);
    } catch (error) {
        return res.send(404).send('未找到对应ID的角色');
    }
});
module.exports = router;
