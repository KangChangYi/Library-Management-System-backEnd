/* eslint-disable no-underscore-dangle */
const express = require('express');
// 引入 express 框架
const router = express.Router();
const bcrypt = require('bcrypt'); // 引入加密密码库

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件
const admin = require('../middleware/admin'); // 导入验证 是否是管理员 中间件

const { User, validateUser } = require('../models/user'); // 导入 User 模块  和 user 验证

// GET 用户列表
// query  : page  limit  name
router.get('/', async (req, res) => {
    try {
        let { page, limit } = req.query;
        const { name } = req.query;
        const condition = name !== 'false' ? new RegExp(`${name}`, 'i') : false;

        let userList;
        let totalCount;
        if (condition) {
            userList = User.find({ role: { $ne: '5cc5842d8fdf583b48486b02' }, email: condition });
            totalCount = User.countDocuments({ role: { $ne: '5cc5842d8fdf583b48486b02' }, email: condition });
        } else {
            userList = User.find({ role: { $ne: '5cc5842d8fdf583b48486b02' } });
            totalCount = User.countDocuments({ role: { $ne: '5cc5842d8fdf583b48486b02' } });
        }

        page = Number(page);
        limit = Number(limit);
        userList = await userList
            .populate('role', 'roleName-_id')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ auditPass: false });
        totalCount = await totalCount;

        return res.send({ userList, totalCount });
    } catch (error) {
        return res.status(404).send('未找到对应用户数据');
    }
});

// GET 自身用户信息 （带token）
router.get('/me', auth, async (req, res) => {
    const user = await User
        .findById(req.user._id) // auth 中间件解析 token
        .select('-password -auditPass -__v')
        .populate('role', 'roleName-_id');
    res.send(user);
});

// GET 指定用户（id）
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
    if (user) return res.status('400').send('该邮箱已被注册');

    user = new User({
        role: req.body.role,
        // accountName: req.body.accountName,
        email: req.body.email,
        password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10); // 创建 salt
    user.password = await bcrypt.hash(user.password, salt); // hash 密码

    user = await user.save();
    return res.send('注册成功，等待审核');
});

// PUT 更新用户信息
router.put('/:id', auth, async (req, res) => {
    // const { error } = validateUser(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            nickName: req.body.nickName,
            gender: req.body.gender,
        }, { new: true });
        return res.send(user);
    } catch (err) {
        return res.status(404).send('未找到相应id的用户');
    }
});

// PUT 修改密码
router.put('/password/:id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        const validatePassWord = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validatePassWord) return res.status(400).send('密码错误');

        const salt = await bcrypt.genSalt(10); // 创建 salt
        const newPassword = await bcrypt.hash(req.body.newPassword, salt); // hash 密码
        // 修改密码
        user = await User.findByIdAndUpdate(req.params.id, {
            password: newPassword,
        });
        return res.send('密码修改成功');
    } catch (error) {
        return res.status(500).send('修改密码失败');
    }
});
// DELETE 删除用户
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(404).send('未找到相应id的用户');
    }
});

// PUT 用户权限通过
router.put('/passAuth/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            auditPass: true,
        }, { new: true });
        res.send(user);
    } catch (error) {
        res.status(404).send('未找到对应id的用户');
    }
});

module.exports = router;
