const config = require('config'); // 不同环境下的配置

module.exports = function setConfig() {
    // export lib_jwtPrivatekey=myKey  在运新环境中定义jwt
    if (!config.get('jwtPrivateKey')) {
        throw new Error('错误：jwt 未定义');
    }
    // debug(`NODE_ENV:${process.env.NODE_ENV}`);
    // debug(`${app.get('env')}`);
};
