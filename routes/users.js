const express = require("express");      // 引入 express 框架
const router = express.Router();

const { User, validateUser } = require('../models/user');   // 导入 User 模块  和 user 验证

// GET 用户列表
router.get('/', async (req, res) => {
    const userList = await User.find().sort('roleName');
    res.send(userList);
});

// GET 用户列表（id）
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (error) {
        res.status('404').send('未找到相应id的用户');
    };
});

// POST 增加用户
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message)
    };
    let user = new User({
        roleId: req.body.roleId,
        userName: req.body.userName,
        passWord: req.body.passWord,
        nickName: req.body.nickName,
        gener: req.body.gener,
        email: req.body.email,
    });
    user = await user.save();
    res.send(user);
});

// PUT 更新用户信息
router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message)
    };
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            roleId: req.body.roleId,
            userName: req.body.userName,
            passWord: req.body.passWord,
            nickName: req.body.nickName,
            gener: req.body.gener,
            email: req.body.email,
        }, { new: true });
        res.send(user);
    } catch (error) {
        res.status('404').send('未找到对应_id');
    };
});

// DELETE 删除用户
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status("404").send('未找到对应_id');
    }
});

module.exports = router;