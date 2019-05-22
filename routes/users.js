/* eslint-disable no-underscore-dangle */
const express = require('express');
// 引入 express 框架
const router = express.Router();
const bcrypt = require('bcrypt'); // 引入加密密码库

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件
const admin = require('../middleware/admin'); // 导入验证 是否是管理员 中间件

const { User, validateUser } = require('../models/user'); // 导入 User 模块  和 user 验证

// GET 用户列表
router.get('/', async (req, res) => {
    const userList = await User
        .find()
        .populate('role', 'roleName-_id');
    res.send(userList);
});

// GET 自身用户信息 （带token）
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-passWord');
    res.send(user);
});

// GET 用户列表（id）
router.get('/:id', async (req, res) => {
    try {
        const user = await User
            .findById(req.params.id)
            .populate('role', 'roleName-_id');
        res.send(user);
    } catch (error) {
        res.status('404').send('未找到相应id的用户');
    }
});

// POST 用户注册
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('该邮箱已被注册');

    user = new User({
        role: req.body.role,
        // accountName: req.body.accountName,
        email: req.body.email,
        passWord: req.body.passWord,
    });

    const salt = await bcrypt.genSalt(10); // 创建 salt
    user.passWord = await bcrypt.hash(user.passWord, salt); // hash 密码

    user = await user.save();
    return res.send(user);
});

// PUT 更新用户信息
router.put('/:id', auth, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            passWord: req.body.passWord,
            nickName: req.body.nickName,
            gener: req.body.gener,
        }, { new: true });
        return res.send(user);
    } catch (err) {
        return res.status('404').send('未找到相应id的用户');
    }
});

// DELETE 删除用户
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status('404').send('未找到相应id的用户');
    }
});

module.exports = router;
