import { Enrollment, SCourse, Sequelize, sequelize, Student_view } from "../db/sql.js";
import { DataTypes, EmptyResultError, where } from "sequelize";

import jwt from "jsonwebtoken"


import { RESULT } from "../utils/constant.js";

import { User, Student, Student_courses_view } from "../db/sql.js";
const Op = Sequelize.Op;


class student {
    constructor() { }

    // 学生注册
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

    // 管理员添加学生
    async addStudent(req, res, next) {
        const { username, student_name, student_id, major, grade, gender } = req.body;

        const isExisted = await User.userFindOne({ where: { username } }) || await Student.studentFindOne({ where: { student_id } });

        if (isExisted) {
            res.json(RESULT.REPEAT_REGISTER)
            return
        }

        await sequelize.transaction(async (t) => {
            const user = await User.userCreate({ username, password: 123456, role: 'student' }, { transaction: t });
            const student = await Student.studentCreate({ student_id, name: student_name, major, grade, gender, user_id: user.user_id }, { transaction: t });
            res.json(RESULT.SUCCESS)
        }).catch(async err => {
            console.log('err', err)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }


    // 更新学生信息
    async updateStudent(req, res, next) {
        const { user_id, student_name, gender, grade, major, student_id, username } = req.body

        Student.studentUpdate({ name: student_name, gender, grade, major, username, student_id }, { where: { user_id } }).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 查学生
    async findStudent(req, res, next) {
        let { pageSize, pageNum, keyword } = req.query
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        const offset = ((pageNum - 1) || 0) * (pageSize || 8); // 确保正确计算偏移量
        const limit = pageSize || 8;

        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    username: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                {
                    student_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};

        try {
            const result = await Student_view.findAndCountAll({
                attributes: ['user_id', 'student_id', 'username', 'student_name', 'gender', 'grade', 'major'], // 返回课程的ID、名称、描述
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['user_id', 'ASC']] // 按照用户id升序
            });

            // 返回查询结果
            res.json({
                ...RESULT.SUCCESS,
                data: {
                    total: result.count,
                    data: result.rows
                }
            });
        } catch (err) {
            console.log('err', err);
            res.json(RESULT.INTERNAL_ERROR);
        }

    }

    // 学生选课
    async choseCourse(req, res, next) {
        const { scourse_id } = req.body


        let { username } = req.decoded

        let isExistStudent = await Student_view.findOne({ where: { username }, attributes: ['student_id'] })
        if (!isExistStudent) {
            res.json(RESULT.USER_NOT_EXIST)
            return
        }
        let student_id = isExistStudent.student_id
        let chosenIt = await Enrollment.findOne({ where: { scourse_id, student_id } })
        if (chosenIt) {
            res.json(RESULT.CHOSEN_COURSE)
            return
        }
        Enrollment.create({ student_id, scourse_id, grade: 0 }).then(result => {
            res.json(RESULT.CHOOSE_SUCCESS)
        }).catch(err => {
            console.log('err', err)
            res.json(RESULT.OP_ERROR)
        })
    }

    // 查询当前学生的选课情况
    async findMyCourse(req, res, next) {
        let { username } = req.decoded

        let { pageSize, pageNum, keyword } = req.query
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        let offset, limit
        if (pageNum && pageSize) {
            offset = ((pageNum - 1) || 0) * (pageSize || 8); // 确保正确计算偏移量
            limit = pageSize || 8;
        }


        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    teacher_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                {
                    course_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};
        try {
            let result = await Student_courses_view.findAndCountAll({
                attributes: ['enrollment_id', 'grade', 'course_id', 'scourse_id', 'course_name', 'teacher_name', 'day', 'time'],
                where: whereCondition,
                limit: limit,
                offset: offset,
                order: [['enrollment_id', 'ASC']] // 按照用户id升序
            })
            res.json({
                ...RESULT.SUCCESS,
                data: {
                    total: result.count,
                    data: result.rows
                }
            })
        } catch (e) {
            console.log('e', e)
            res.json(RESULT.OP_ERROR)
        }



    }

    // 取消选课
    async cancelCourse(req, res, next) {
        const { enrollment_id } = req.body

        Enrollment.destroy({where: {enrollment_id}}).then(result=>{
            res.json(RESULT.CANCEL_SUCCESS)
        }).catch(e=>{
            console.log('e',e)
            res.json(RESULT.OP_ERROR)
        })

    }
}


const studentController = new student();

export default studentController