const express = require("express");
const router = express.Router();

const bookType = [
    { typeId: 1, typeName: '文学类' },
    { typeId: 2, typeName: '技术类' },
    { typeId: 3, typeName: '岩土类' },
    { typeId: 4, typeName: '机械类' }
]

// GET 获取图书类别列表
router.get('/', (req, res) => {
    // const bookTypeList = bookType.map((val, idx) => {
    //     return val.typeName;
    // })
    res.send(bookType)
})

// POST 增加图书类别
router.post('/', (req, res) => {
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    };
    const type = {
        typeId: bookType.length + 1,
        typeName: req.body.typeName
    };
    bookType.push(type);
    res.send(type);
})

// PUT 更新图书类别
router.put('/:typeId', (req, res) => {
    const type = bookType.find(book => parseInt(req.params.typeId) === book.typeId);
    if (!type) {
        return res.status("404").send("typeId not found!");
    };
    const { error } = validateBookType(req.body);
    if (error) {
        return res.status("400").send(error.details[0].message);
    };
    type.typeName = req.body.typeName;
    res.send(type);
})

// DELETE 删除图书类别
router.delete('/:typeId', (req, res) => {
    const type = bookType.find(book => parseInt(req.params.typeId) === book.typeId);
    if (!type) {
        return res.status('404').send("typeId not fount!");
    };
    const book = bookType.indexOf(type);
    bookType.splice(book, 1);
    res.send(type);
})

// 验证
function validateBookType (type) {
    const rule = {
        typeName: Joi.string().required()
    }
    return Joi.validate(type, rule);
}

module.exports = router;