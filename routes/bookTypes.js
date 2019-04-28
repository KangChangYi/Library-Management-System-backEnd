const express = require("express");           // 引入 express 框架
const router = express.Router();

const { BookType, validateBookType } = require('../models/bookType')      // 导入 BookType 模块 和 bookType 验证


// GET 获取图书类别列表
router.get('/', async (req, res) => {
    const bookTypeList = await BookType.find().sort('typeName');
    res.send(bookTypeList);
});

// GET 按_id 查找图书类别
router.get('/:id', async (req, res) => {
    try {
        const bookType = await BookType.findById(req.params.id);
        res.send(bookType)
    } catch (error) {
        res.status('404').send('未找到对应_id');
    }
});

// POST 增加图书类别
router.post('/', async (req, res) => {
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    };
    let bookType = new BookType({
        typeName: req.body.typeName
    })
    bookType = await bookType.save();
    res.send(bookType);
});

// PUT 更新图书类别
router.put('/:id', async (req, res) => {
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    };
    try {
        const bookType = await BookType.findByIdAndUpdate(req.params.id, { typeName: req.body.typeName }, { new: true });
        res.send(bookType);
    } catch (err) {
        res.status('404').send('未找到对应_id');
    }
});

// DELETE 删除图书类别
router.delete('/:id', async (req, res) => {
    try {
        const bookType = await BookType.findByIdAndRemove(req.params.id);
        res.send(bookType);
    } catch (err) {
        res.status('404').send('未找到对应_id');
    }
});

module.exports = router;