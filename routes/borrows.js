const express = require('express');

const router = express.Router();

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件

// Model
const { Borrow, validateBorrow, validateReturn } = require('../models/borrow');
const { BookInfo } = require('../models/bookInfo');
const { User } = require('../models/user'); // 导入 User 模块

// GET 获取图书借还信息
router.get('/', async (req, res) => {
    try {
        let { page, limit } = req.query;
        const { id } = req.query;
        page = Number(page);
        limit = Number(limit);

        const borrowInfo = await Borrow
            .find({ userId: id })
            .populate('bookInfo')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort('borrowDate');

        return res.send(borrowInfo);
    } catch (error) {
        console.log(error);
        return res.status(404).send('未找到对应的借阅信息');
    }
});

// POST 图书借阅  params: 图书信息ID
router.post('/:id', [auth], async (req, res) => {
    try {
        const { error } = validateBorrow(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // 根据权限 决定不同应还日期
        const userInfo = await User.findById(req.body.userId);
        let shouldDate;
        if (userInfo.role.toString() === '5cc5843da817d63c606f501f') {
            shouldDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 90)); // 教师
        } else {
            shouldDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 60)); // 学生
        }

        // 找到要借的图书
        const bookInfo = await BookInfo.findById(req.params.id);
        // 是否有书可借
        const isAllLend = bookInfo.books.every(val => val.isLend === true);
        if (isAllLend) {
            return res.status(500).send('没有图书可以借');
        }
        // 找出一本未借出的书
        let bookId;
        for (let i = 0; i < bookInfo.books.length; i += 1) {
            if (bookInfo.books[i].isLend === false) {
                bookId = bookInfo.books[i]._id;
                bookInfo.books[i].isLend = true; // 表示借出
                break;
            }
        }
        await bookInfo.save();

        // 新增一条 借阅信息
        let borrow = new Borrow({
            bookInfo: req.params.id,
            userId: req.body.userId,
            bookId,
            borrowDate: Date.now(),
            shouldDate,
        });
        borrow = await borrow.save();

        return res.send(borrow);
    } catch (error) {
        return res.status(404).send('未找到对应id的图书信息');
    }
});

//  PUT 图书归还  params：借还表ID  body: bookInfoId,bookId
router.put('/:id', [auth], async (req, res) => {
    try {
        const { error } = validateReturn(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // 对应借阅信息
        let borrow = await Borrow.findById(req.params.id);
        // 对应书籍
        const bookInfo = await BookInfo.findById(req.body.bookInfoId);
        // 找到对应id图书 ，还书
        bookInfo.books.forEach((val, idx) => {
            if (val._id === req.body.bookId) {
                bookInfo.books[idx].isLend = false;
            }
        });
        await bookInfo.save();
        // 计算罚款
        const sDate = new Date(borrow.shouldDate).getTime(); // 应还日期
        const rDate = new Date().getTime(); // 还书如期
        // 罚款金额
        let amountFine = 0;
        if (rDate > sDate) {
            amountFine = (rDate - sDate) / (1000 * 60 * 60 * 24);
            borrow.amountFine = amountFine / 10; //  1天 = 0.1
            borrow.isPayment = true;
        }
        borrow.returnDate = new Date();
        borrow.isLend = false;
        borrow = await borrow.save();
        return res.send(borrow);
    } catch (error) {
        console.log(error);
        return res.status(404).send('未找到对应id的借阅信息');
    }
});
module.exports = router;
