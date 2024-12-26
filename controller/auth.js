import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, where } from "sequelize";

import UserModel from '../model/user.js'
import TeacherModel from '../model/teacher.js'
import StudentModel from "../model/student.js"
import { RESULT } from "../utils/constant.js";
const User = new UserModel(sequelize, DataTypes)



class auth {
    constructor() { }

    // 验证是否为管理员
    async verifyIsAdmin(req, res, next) {
        let { username } = req.decoded
        const user = await User.userFindOne({ where: { username } })
        if (!user || user.role != 'admin') {
            res.json(RESULT.FORBIDDEN)
        }else next()
    }
}

const AuthController = new auth()

export default AuthController
