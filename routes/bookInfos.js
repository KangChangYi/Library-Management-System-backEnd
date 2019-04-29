const express = require('express');
const router = express.Router();

const { BookInfo, validateBookInfo, Book } = require('../models/bookInfo');

// GET 获取所有图书信息
router.get('/', async (req, res) => {
    const bookInfo = await BookInfo
        .find()
        .populate('bookType', ["typeId", "typeName"])
        .sort('bookName');
    res.send(bookInfo);
});

// GET 获取指定图书信息
router.get('/:id', async (req, res) => {
    try {
        const bookInfo = await BookInfo
            .findById(req.params.id)
            .populate('bookType', ["typeId", "typeName"]);
        res.send(bookInfo);
    } catch (error) {
        res.status('404').send("未找到相应id的图书信息");
    };
});

// POST 增加图书信息  默认自带一本书
router.post('/', async (req, res) => {
    const { error } = validateBookInfo(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    };
    let bookInfo = new BookInfo({
        books: [new Book()],
        bookType: req.body.bookType,
        bookName: req.body.bookName,
        author: req.body.author,
        press: req.body.press,
        publicationDate: req.body.publicationDate
    });
    bookInfo = await bookInfo.save();
    res.send(bookInfo);
});

// PUT 更新图书信息
router.put('/:id', async (req, res) => {
    const { error } = validateBookInfo(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    };
    try {
        const bookInfo = await BookInfo.findByIdAndUpdate(req.params.id, {
            bookType: req.body.bookType,
            bookName: req.body.bookName,
            author: req.body.author,
            press: req.body.press,
            publicationDate: req.body.publicationDate,
        }, { new: true });
        res.send(bookInfo);
    } catch (error) {
        return res.status('404').send('未找到对应id的图书信息');
    };
});

// DELETE 图书信息删除
router.delete('/:id', async (req, res) => {
    try {
        const bookInfo = await BookInfo.findByIdAndDelete(req.params.id);
        res.send(bookInfo);
    } catch (error) {
        res.status('404').send('未找到对应id的图书信息');
    };
});

// PUT 图书数量增加
router.post('/book/:id', async (req, res) => {
    if (req.body.number < 1) {
        return res.status('400').send("数量不符");
    };
    try {
        const bookInfo = await BookInfo.findById(req.params.id);
        const books = [];
        for (let i = 0; i < req.body.number; i++) {
            books.push(new Book());
        };
        bookInfo.books = bookInfo.books.concat(books);
        const result = await bookInfo.save();
        res.send(result);
    } catch (error) {
        return res.status('404').send('未找到相应id的图书信息');
    }
});

// DELETE 图书数量删除
router.delete('/book/:id/:bid', async (req, res) => {
    try {
        const bookInfo = await BookInfo.findById(req.params.id);
        const book = bookInfo.books.id(req.params.bid);
        let result = book.remove();
        result = bookInfo.save();
        res.send(result)
    } catch (error) {
        return res.status('404').send('未找到对应id的图书信息');
    }
})

module.exports = router;