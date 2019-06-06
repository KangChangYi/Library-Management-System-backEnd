const express = require('express');

const router = express.Router();

const auth = require('../middleware/authenticating'); // 导入验证 token 中间件
const admin = require('../middleware/admin'); // 导入验证 是否是管理员 中间件

// 将数据中的图片名替换为 base64 数据
// 保存图片的 读写删
const {
    replaceImgToBase64, uploadImg, readImg, removeImg,
} = require('../utils/imgOperation');

// Model
const { BookInfo, validateBookInfo, Book } = require('../models/bookInfo');

// GET 获取图书信息
// query : { page:require , limit:require , name , type }
router.get('/', async (req, res) => {
    try {
        let { page, limit } = req.query;
        const condition = req.query.name !== 'false' ? new RegExp(`${req.query.name}`, 'i') : false;
        const type = req.query.type !== 'false' ? req.query.type : false;

        let bookInfo = null;
        let totalCount;
        if (type && condition) { // 图书类型 和 搜索书名
            bookInfo = BookInfo.find({ bookType: type, bookName: condition });
            totalCount = BookInfo.countDocuments({ bookType: type, bookName: condition });
        } else if (type) { // 图书类型
            bookInfo = BookInfo.find({ bookType: type });
            totalCount = BookInfo.countDocuments({ bookType: type });
        } else if (condition) { // 搜索书名
            bookInfo = BookInfo.find({ bookName: condition });
            totalCount = BookInfo.countDocuments({ bookName: condition });
        } else { // 全部
            bookInfo = BookInfo.find();
            totalCount = BookInfo.countDocuments();
        }

        limit = Number(limit);
        page = Number(page);

        bookInfo = await bookInfo
            .populate('bookType', ['typeId', 'typeName'])
            .skip((page - 1) * limit)
            .limit(limit)
            .sort('bookName');

        bookInfo = replaceImgToBase64(bookInfo); // 根据图片名读取图片转为 base64
        totalCount = await totalCount;

        return res.send({ bookInfo, totalCount });
    } catch (error) {
        return res.status('500').send('获取图书信息失败');
    }
});

// GET 获取指定图书信息
router.get('/id/:id', async (req, res) => {
    try {
        let bookInfo = await BookInfo
            .findById(req.params.id)
            .populate('bookType', ['typeId', 'typeName']);

        bookInfo = replaceImgToBase64(bookInfo);
        // bookInfo.image = readImg(bookInfo.image); // 根据图片名读取图片转为 base64

        return res.send(bookInfo);
    } catch (error) {
        return res.status('404').send('未找到相应id的图书信息');
    }
});

// POST 增加图书信息  默认自带一本书
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validateBookInfo(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    }

    // 开始处理图片  成功则返回图片名称，否则报错退出
    const imgName = await uploadImg(req.body.image)
        .then(response => response)
        .catch(() => res.status('500').send('保存图片失败'));

    let bookInfo = new BookInfo({
        books: [new Book()],
        bookType: req.body.bookType,
        bookName: req.body.bookName,
        image: imgName,
        author: req.body.author,
        press: req.body.press,
        publicationDate: req.body.publicationDate,
    });
    bookInfo = await bookInfo.save();
    return res.send(bookInfo);
});

// PUT 更新图书信息
router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validateBookInfo(req.body);
    if (error) {
        return res.status('400').send(error.details[0].message);
    }
    try {
        // 查询到原先的图片  写入新的数据
        let bookInfo = await BookInfo.findById(req.params.id);
        // 更新对应图书图片数据
        await uploadImg(req.body.image, bookInfo.image);
        // 根据 id 找并更新
        bookInfo = await BookInfo.findByIdAndUpdate(req.params.id, {
            bookType: req.body.bookType,
            bookName: req.body.bookName,
            author: req.body.author,
            press: req.body.press,
            publicationDate: req.body.publicationDate,
        }, { new: true });

        return res.send(bookInfo);
    } catch (err) {
        return res.status('404').send('未找到对应id的图书信息');
    }
});

// DELETE 图书信息删除
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const book = await BookInfo.findById(req.params.id);
        // 查询到原先的图片  删除
        await removeImg(book.image);
        // 删除文档
        await BookInfo.deleteOne({ _id: req.params.id });
        res.send('删除成功');
        // const bookInfo = await BookInfo.findByIdAndDelete(req.params.id);
        // res.send(bookInfo);
    } catch (error) {
        res.status('404').send('未找到对应id的图书信息');
    }
});

// 图书信息中的图书操作 ↓↓↓↓↓↓

// POST 图书数量增加
router.post('/book/:id', [auth, admin], async (req, res) => {
    if (req.body.number < 1) {
        return res.status('400').send('数量不符');
    }
    try {
        const bookInfo = await BookInfo.findById(req.params.id);
        const books = [];
        for (let i = 0; i < req.body.number; i += 1) {
            books.push(new Book());
        }
        bookInfo.books = bookInfo.books.concat(books);
        const result = await bookInfo.save();
        return res.send(result);
    } catch (error) {
        return res.status('404').send('未找到相应id的图书信息');
    }
});

// DELETE 删除指定图书
router.delete('/book/:id/:bid', [auth, admin], async (req, res) => {
    try {
        const bookInfo = await BookInfo.findById(req.params.id);
        const book = bookInfo.books.id(req.params.bid);
        book.remove();
        bookInfo.save();
        return res.send('删除成功');
    } catch (error) {
        return res.status('404').send('未找到对应id的图书信息');
    }
});

module.exports = router;
