import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, EmptyResultError, where } from "sequelize";

import jwt from "jsonwebtoken"

import { RESULT } from "../utils/constant.js";
import { Teacher, User, Teacher_view, SCourse_view } from "../db/sql.js"
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
        const { user_id, teacher_name, teacher_id, gender, department } = req.body

        Teacher.teacherUpdate({ name: teacher_name, gender, department, teacher_id }, { where: { user_id } }).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 管理员添加老师
    async addTeacher(req, res, next) {
        const { username, teacher_name, teacher_id, gender, department } = req.body;

        const isExisted = await User.userFindOne({ where: { username } }) || await Teacher.findOne({ where: { teacher_id } });

        if (isExisted) {
            res.json(RESULT.REPEAT_REGISTER)
            return
        }

        await sequelize.transaction(async (t) => {
            const user = await User.userCreate({ username, password: 123456, role: 'teacher' }, { transaction: t });
            const teacher = await Teacher.create({ teacher_id, name: teacher_name, department, gender, user_id: user.user_id }, { transaction: t });
            res.json(RESULT.SUCCESS)
        }).catch(async err => {
            console.log('err', err)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 查询老师 
    async findTeacher(req, res, next) {
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
                    teacher_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};

        try {
            const result = await Teacher_view.findAndCountAll({
                attributes: ['user_id', 'teacher_id', 'username', 'teacher_name', 'gender', 'department'], // 返回课程的ID、名称、描述
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


    // 查询我当前的课程
    async findMyCourse(req, res, next) {
        let { pageSize, pageNum, keyword, day, time } = req.query
        const { username } = req.decoded

        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        const offset = ((pageNum - 1) || 0) * (pageSize || 8); // 确保正确计算偏移量
        const limit = pageSize || 8;


        let myInfo = await Teacher_view.findOne({ where: { username }, attributes: ['teacher_id'] })
        let teacher_id


        if (myInfo) {
            teacher_id = myInfo.teacher_id
        } else {
            res.json(RESULT.OP_ERROR)
            return
        }


        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    course_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};
        if (day) whereCondition['day'] = day
        if (time) whereCondition['time'] = time
        if (teacher_id) whereCondition['teacher_id'] = teacher_id

        console.log('teacher_id', teacher_id)
        try {
            const result = await SCourse_view.findAndCountAll({
                attributes: ['scourse_id', 'course_id', 'course_name', 'day', 'time'],
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['scourse_id', 'ASC']] // 按照用户id升序
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



}

const teacherController = new teacher();

export default teacherController