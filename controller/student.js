import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, EmptyResultError, where } from "sequelize";

import jwt from "jsonwebtoken"


import { RESULT } from "../utils/constant.js";

import { User, Student } from "../db/sql.js";
const Op = Sequelize.Op;


class student {
    constructor() { }

    async createStudent(req, res, next) {
        const { username, password, rePassword, role, name, student_id, major, grade, gender } = req.body;

        const isExisted = await User.userFindOne({ where: { username } }) || await Student.studentFindOne({ where: { student_id } });

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
            const student = await Student.studentCreate({ student_id, name, major, grade, gender, user_id: user.user_id }, { transaction: t });
            res.json(RESULT.SUCCESS)
        }).catch(async err => {
            console.log('err', err)
            res.json(RESULT.INTERNAL_ERROR)
        })

    }

    async updateStudent(req, res, next) {
        const { user_id, name, gender, grade ,major} = req.body
        
        Student.studentUpdate({ name, gender, grade, major }, { where: { user_id } }).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }
}

const studentController = new student();

export default studentController