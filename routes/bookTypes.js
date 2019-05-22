const express = require('express');
// 引入 express 框架
const router = express.Router();

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件
const admin = require('../middleware/admin'); // 导入验证 是否是管理员 中间件

const { BookType, validateBookType } = require('../models/bookType'); // 导入 BookType 模块 和 bookType 验证


// GET 获取图书类别列表
router.get('/', async (req, res) => {
    const bookTypeList = await BookType.find().sort('typeName');
    res.send(bookTypeList);
});

// GET 按_id 查找图书类别
router.get('/:id', async (req, res) => {
    try {
        const bookType = await BookType.findById(req.params.id);
        res.send(bookType);
    } catch (error) {
        res.status('404').send('未找到对应_id');
    }
});

// POST 增加图书类别
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let bookType = new BookType({
        typeName: req.body.typeName,
    });
    bookType = await bookType.save();
    return res.send(bookType);
});

// PUT 更新图书类别
router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    }
    try {
        const bookType = await BookType.findByIdAndUpdate(req.params.id,
            { typeName: req.body.typeName }, { new: true });
        return res.send(bookType);
    } catch (err) {
        return res.status('404').send('未找到对应_id');
    }
});

// DELETE 删除图书类别
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const bookType = await BookType.findByIdAndRemove(req.params.id);
        res.send(bookType);
    } catch (err) {
        res.status('404').send('未找到对应_id');
    }
});

module.exports = router;
