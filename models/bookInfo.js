const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isLend: { type: Boolean, default: false }
});
const Book = mongoose.model('book', bookSchema);

const BookInfo = mongoose.model('bookInfo', new mongoose.Schema({
    books: [bookSchema],
    bookType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookType"
    },
    bookName: String,
    author: String,
    press: String,
    publicationDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}));

function validateBookInfo (data) {
    const rule = {
        book: Joi.array(),
        bookType: Joi.string().required(),
        bookName: Joi.string().required(),
        author: Joi.string().required(),
        press: Joi.string().required(),
        publicationDate: Joi.date(),
    };
    return Joi.validate(data, rule);
};

module.exports = {
    BookInfo,
    validateBookInfo,
    Book
}