const express = require("express");
const router = express.Router();

const role = [
    { roleId: 1, roleName: '学生' },
    { roleId: 2, roleName: '教师' },
    { roleId: 3, roleName: '管理员'}
];

// GET 获取角色列表
router.get('/', (req, res) => {
    // const roleNameList = role.map((val, idx) => {
    //     return val.roleName;
    // });
    res.send(role)
})

module.exports = router;