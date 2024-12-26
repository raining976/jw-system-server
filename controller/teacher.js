import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, EmptyResultError, where } from "sequelize";

import jwt from "jsonwebtoken"

import { RESULT } from "../utils/constant.js";
import { Teacher, User } from "../db/sql.js"
const Op = Sequelize.Op;


class teacher {
    constructor() { }

    // 添加老师
    async createTeacher(req, res, next) {
        const { username, password, rePassword, role, name, teacher_id, department, gender } = req.body;
        const isExisted = await User.userFindOne({ where: { username } }) || await Teacher.teacherFindOne({ where: { teacher_id } });

        if (isExisted) {
            res.json(RESULT.REPEAT_REGISTER)
            return
        }
        if (password != rePassword) {
            res.json(RESULT.REPASS_ERROR)
            return
        }

        await sequelize.transaction(async (t) => {
            const user = await User.userCreate({ username, password, role }, { transaction: t });
            const teacher = await Teacher.teacherCreate({ teacher_id, name, gender, department, user_id: user.user_id }, { transaction: t });
            res.json(RESULT.SUCCESS)
        }).catch(async err => {
            console.log('err', err)
            res.json(RESULT.INTERNAL_ERROR)
        })

    }

    // 更新老师
    async updateTeacher(req, res, next) {
        const { user_id, name, gender, department } = req.body

        Teacher.teacherUpdate({ name, gender, department }, { where: { user_id } }).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    


}

const teacherController = new teacher();

export default teacherController