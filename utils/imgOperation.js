const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');

// params: imgName (String)
function readImg(imgName) {
    const filePath = path.resolve(`./uploads/${imgName}`); // 获取图片路径

    let fileData = fs.readFileSync(filePath, (err, val) => val); // 读取图片为 buffer

    fileData = Buffer.from(fileData).toString('base64'); // 转换 buffer 为 base64

    const base64 = `data:${mineType.lookup(filePath)};base64,${fileData}`; // 增加 base64 头部

    return base64;
}

// params: imgae (base64)  oldName (String)
function uploadImg(image, oldName = false) {
    // 封装 Promise 将 base64格式图片数据保存为图片
    return new Promise((resolve, reject) => {
        const imgData = image;
        const base64Data = imgData.replace(/^data:image\/\w+;base64,/, ''); // 去除 base64 固定头部
        const bufferData = Buffer.from(base64Data, 'base64'); // 转换成二进制 buffer 格式

        let imgName;
        if (oldName) {
            imgName = `./uploads/${oldName}`; // 已有的名字
        } else {
            const number = Math.random() * 10000 + 1000;
            imgName = `./uploads/${number}.png`; // 随机的名字
        }

        fs.writeFile(imgName, bufferData, (err) => {
            if (!err) {
                resolve(imgName.split('/').reverse()[0]);
            } else {
                reject(err);
            }
        });
    });
}

// params: imgName (String)
function removeImg(imgName) {
    // 封装 Promise 将 base64格式图片数据保存为图片
    return new Promise((resolve, reject) => {
        fs.unlink(`./uploads/${imgName}`, (err) => {
            if (err) reject(err);
            resolve('文件已删除');
        });
    });
}

function replaceImgToBase64(bookInfo) {
    bookInfo.forEach((val, idx) => { // 根据图片名读取图片转为 base64
        const base64 = readImg(val.image);
        bookInfo[idx].image = base64;
    });
    return bookInfo;
}

module.exports = {
    replaceImgToBase64, readImg, uploadImg, removeImg,
};
