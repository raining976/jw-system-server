/**
 * 数据返回code msg
 */
const RESULT = {
    SUCCESS: { code: 20000, msg: '成功' },
    CREATE_SUCCESS: { code: 20001, msg: '创建成功' },
    UPDATE_SUCCESS: { code: 20002, msg: '修改成功' },
    DELETE_SUCCESS: { code: 20003, msg: '删除成功' },
    NO_DATA: { code: 20004, msg: '查询不到数据' },
    LOGIN_SUCCESS: { code: 20005, msg: '登录成功' },
    CHOOSE_SUCCESS: { code: 20006, msg: '选课成功' },
    CANCEL_SUCCESS: { code: 20007, msg: '退选成功' },
    APPLY_SUCCESS: { code: 20008, msg: '申请成功' },
    


    ARG_ERROR: { code: 40000, msg: '参数错误' },
    OP_ERROR: { code: 40002, msg: "操作失败" },
    REPEAT_REGISTER: { code: 40011, msg: '该用户已经存在' },
    USER_NOT_EXIST: { code: 40012, msg: '用户不存在' },
    PASSWORD_ERROR: { code: 40013, msg: '密码错误' },
    REPASS_ERROR: { code: 400014, msg: '两次密码不一致' },
    TEACHER_NOT_EXIST: { code: 40015, msg: "老师不存在" },
    COURSE_NOT_EXIST: { code: 40016, msg: "课程不存在" },
    EXIST_SCOURSE: { code: 40017, msg: '该老师在当前时间段已经安排课程' },
    CHOSEN_COURSE: { code: 40018, msg: "该课程已选" },

    NO_LOGIN: { code: 40001, msg: '未登录' },
    FORBIDDEN: { code: 40003, msg: '无权限访问' },
    NOT_FOUND: { code: 40004, msg: '未找到' },
    UPLOAD_ERR: { code: 40005, msg: '上传失败' },
    INTERNAL_ERROR: { code: 50000, msg: '非法操作' },
    FAIL: { code: 50003, msg: '请求失败' },
    TOKEN_NO_FIND: { code: 60001, msg: '登录失效,请重新登录' },
    TOKEN_ERR: { code: 60002, msg: '登录失效,请重新登录' },
};
const JWT_SECRET = 'dev-secret'

export { RESULT, JWT_SECRET }