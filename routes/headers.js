import jwt, { decode } from "jsonwebtoken"
import { JWT_SECRET, RESULT } from '../utils/constant.js'

//请求数据设备类型
function appType(req, res, next) {
    let type = req.headers['app-type'];
    if (type) {
        next();
    } else {
        res.json({
            code: RESULT.ARG_ERROR.code,
            msg: 'app-type不能为空',
            // data: {}
        });
    }
}


function getToken(str) {
    const match = str.match(/^Bearer\s([A-Za-z0-9\-_\.]+)/);
    return match ? match[1] : null;
}

//token验证
function token(req, res, next) {
    if (req.path.includes('/login') || req.path.includes('/register')) {
        next();
        return
    }
    // 取token 数据
    let token = req.headers['authorization'];
    token = getToken(token)
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    code: RESULT.TOKEN_ERR.code,
                    msg: RESULT.TOKEN_ERR.msg,
                });
            } else {
                req.decoded = decoded;
                next();//继续下一步路由
            }
        })
    } else {
        res.json({
            code: RESULT.TOKEN_NO_FIND.code,
            msg: RESULT.TOKEN_NO_FIND.msg,
        });
    }
}


export { appType, token }