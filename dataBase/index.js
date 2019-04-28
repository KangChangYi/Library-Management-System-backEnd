const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/LibraryManagementSystemDB', { useNewUrlParser: true })
    .then(() => console.log("connection ok!"))
    .catch(err => console.error(err))

const bookTypeSchema = new mongoose.Schema({
    typeId: { type: String, required: true },
    // schema 类型选项
    // lowercase: true
    // setter 和 getter
    // get:v => Math.round(v),
    // set:v => Math.round(v),
    // 内置验证器
    // typeId: {
    //     // 类型
    //     type: String,
    //     // 必填
    //     required: true,
    //     // 必须是其中一个
    //     enum: ['1', '2', '3'],
    //     // 最小和最大长度
    //     minlength: 5,
    //     maxlength: 255,
    // },

    // 自定义验证器 可异步
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: '这里写错误信息'
        }
    },
    typeName: String,
});

const BookType = mongoose.model('bookTypes', bookTypeSchema);




// 数据库插入
// async function createBookType () {
//     const bookType = new BookType({
//         typeId: '3',
//         typeName: '技术类'
//     });

//     const result = await bookType.save();
//     console.log(result);
// 捕获mongoose验证错误信息
// try {
//     const result = await bookType.save();
//     console.log(result);
// } catch (ex) {
//     for (let filed in ex.error) {
//         console.log(ex.error[filed].message)
//     }
// }
//     console.log(result);
// }
// createBookType();


// 数据库查询
async function getBookType () {
    // 比较查询操作符
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than equal to)
    // lt (less than)
    // lte (less than equal to)
    // in
    // nin (not in)
    // .find({ typeId: { $in: ['1', '2'] } }) //比较查询操作符

    // 逻辑查询操作符
    // or
    // and
    // .or([{ typeId: 1 }, { typeName: '技术类' }]) //逻辑查询操作符

    // 支持正则
    // .find({ typeName: /^'文学类'/ }) //以文学类开头
    // .fine({ typeName: /'文学类$/' }) //以文学类结尾

    // 分页
    // const pageNumber = 2;
    // const pageSize = 10;
    // const result = await BookType
    // .find()
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)   //固定个数

    // 排序 
    // .sort({ typeId: 1 })  //1升序  -1降序

    // 指定返回项
    // .select({ typeId: 1, typeName: 1}) //只需返回这两项

    // 计数
    // .count();  //返回查询结果计数

    const result = await BookType
        .find()

    console.log(result);
}
getBookType();
// 指明数据库          // 指定集合名称       // 指定文件名        // 表明数据是json数组
// mongoimport --db mongo-exercises --collection courses --file filename.json --jsonArray


// 第一种 更新数据库方法
// async function updateBookType (id) {
//     const type = await BookType.findById(id);
//     if (!type) return;
//     type.typeName = '恐怖类';
//     // type.set({
//     //     typeName: '恐怖类'
//     // })
//     const result = await type.save();
//     console.log(result);
// }


// 第二种 更新数据库方法
// async function updateBookType (id) {
//     const result = await BookType.update({ _id: id }, {
//         $set: {
//             typeName: '哈哈哈'
//         }
//     });
//     console.log(result);
// }
// updateBookType('5cc43b856ffb0b2fbceca30b')


// 删除数据库方法  一条和多条删除
// async function removeBookType (id) {
//     // 单条
//     // const result = await BookType.deleteOne({ _id: id });
//     // console.log(result);
//     // 多条
//     const result = await BookType.deleteMany({ _id: id });
//     console.log(result);
// }
// removeBookType('5cc43b856ffb0b2fbceca30b')