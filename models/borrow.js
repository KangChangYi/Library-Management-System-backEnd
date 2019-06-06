const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Borrow = mongoose.model('borrow', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    bookInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookInfo',
    },
    bookId: mongoose.Schema.Types.ObjectId,
    borrowDate: { type: Date, default: Date.now },
    shouldDate: Date,
    returnDate: { type: String, default: '-' },
    amountFine: { type: Number, default: 0 },
    isPayment: { type: Boolean, default: false },
    isLend: { type: Boolean, default: true },
}));

// 借书时验证  需要根据用户权限决定最大借出天数
function validateBorrow(data) {
    const rule = {
        userId: Joi.string().required(),
    };
    return Joi.validate(data, rule);
}

// 还书时验证
function validateReturn(data) {
    const rule = {
        bookInfoId: Joi.string().required(),
        bookId: Joi.string().required(),
    };
    return Joi.validate(data, rule);
}

module.exports = {
    Borrow,
    validateBorrow,
    validateReturn,
};
