import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, where } from "sequelize";

import jwt from "jsonwebtoken"


import { RESULT, JWT_SECRET } from "../utils/constant.js";
import { User, Teacher, Student } from "../db/sql.js"

const Op = Sequelize.Op;

class user {
    constructor() { }

    async createUser(req, res, next) {

    }

    // 用户登录
    async login(req, res, next) {
        const { username, password } = req.body;
        const user = await User.userFindOne({ where: { username } });
        if (!user) {
            res.json(RESULT.USER_NOT_EXIST)
            return
        }
        if (user.password !== password) {
            res.json(RESULT.PASSWORD_ERROR)
            return
        }
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ ...RESULT.SUCCESS, data: token })
    }

    // 获取所有用户信息 可以筛选
    async getAllUser(req, res, next) {
        let { pageSize, pageNum, keyword, role } = req.query
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        const offset = ((pageNum - 1) || 0) * (pageSize || 8) || 0
        const limit = pageSize || 8

        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    username: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                // {
                //     role: {
                //         [Sequelize.Op.like]: `%${keyword}%`
                //     }
                // }
            ]
        } : {}

        if (role) whereCondition["role"] = role;

        // 根据角色动态选择要包含的表
        let include = [];
        let studentCondition = keyword ?
            {
                user_id: { [Op.col]: 'User.user_id' },
                [Sequelize.Op.or]: [
                    {
                        name: {
                            [Sequelize.Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        major: {
                            [Sequelize.Op.like]: `%${keyword}%`
                        }
                    }
                ]
            } : { user_id: { [Op.col]: 'User.user_id' },}
        if (role === 'teacher') {
            include.push({
                model: Teacher,
                required: false, // 不强制要求匹配（left join）
                where: {
                    user_id: { [Op.col]: 'User.user_id' },
                },
                attributes: ['teacher_id', 'department', 'name', 'gender'], // 选择教师表的相关字段
                as: 'teacher' // 指定别名
            });
        } else if (role === 'student') {
            include.push({
                model: Student,
                required: false, // 同样不强制要求匹配
                where: studentCondition,
                attributes: ['student_id', 'major', 'grade', 'name', 'gender'], // 选择学生表的相关字段
                as: 'student' // 指定别名
            });
        }


        // 递归展开嵌套对象
        function flattenObject(obj, prefix = '') {
            let result = {};

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const newKey = prefix ? `${key}` : key;
                    const value = obj[key];

                    if (typeof value === 'object' && value !== null) {
                        // 如果值是对象，递归调用并展开
                        Object.assign(result, flattenObject(value, newKey));
                    } else {
                        // 否则直接将值加到结果对象
                        result[newKey] = value;
                    }
                }
            }

            return result;
        }

        await User.userFind({
            attributes: ['user_id', 'username', 'role'], // 可选：选择返回的字段
            where: whereCondition,
            offset: offset,
            limit: limit,
            order: [['user_id', 'DESC']], // 可选：按创建时间降序排序
            include: include
        }).then(result => {
            // 在查询结果中合并 User 和对应角色的相关信息
            const data = result.rows.map(user => {
                const userInfo = user.toJSON();  // 获取用户信息
                let flattenedUser = flattenObject(userInfo);  // 扁平化用户信息
                if (user.role === 'teacher') {
                    const teacherInfo = flattenObject(userInfo.teacher);  // 扁平化教师信息
                    flattenedUser = { ...flattenedUser, ...teacherInfo };
                } else if (user.role === 'student') {
                    const studentInfo = flattenObject(userInfo.student);  // 扁平化学生信息
                    flattenedUser = { ...flattenedUser, ...studentInfo };
                }
                return flattenedUser;
            });
            res.json({
                code: RESULT.SUCCESS.code,
                msg: RESULT.SUCCESS.msg,
                data: {
                    total: result.count,
                    data: data,
                }

            })
        }).catch(err => {
            console.log('err', err)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 删除用户
    async deleteUsers(req, res, next) {
        const { ids } = req.body
        const result = await User.destroy({ where: { user_id: ids } })

        if (result > 0) {
            res.json({ ...RESULT.SUCCESS, data: result })
        } else {
            res.json(RESULT.INTERNAL_ERROR)
        }
    }

    // 获取本人信息
    async getMyInfo(req, res, next) {
        const { username } = req.decoded
        const user = await User.userFindOne({ where: { username } })
        let userInfo = null
        let { user_id } = user
        const role = user.role
        if (user.role == 'student') {
            userInfo = await Student.findOne({
                where: { user_id },
            });
        } else if (user.role == 'teacher') {
            userInfo = await Teacher.findOne({
                where: { user_id },
            });
        } else {
            userInfo = {
                dataValues: {
                    role: 'admin'
                }

            }
        }

        let data = { role, username, ...userInfo.dataValues }

        res.json({ ...RESULT.SUCCESS, data })
    }

    // 更新本人信息
    async updateMyInfo(req, res, next) {
        const { role } = req.body
        if (role == 'student') {
            const { user_id, name, gender, major, grade } = req.body
            let newInfo = { name, gender, major, grade }
            await Student.studentUpdate(newInfo, { where: { user_id } }).then(result => {
                res.json(RESULT.SUCCESS)
            }).catch(e => {
                console.log('error', e)
                res.json(RESULT.INTERNAL_ERROR)
            })
        } else if (role == 'teacher') {
            const { user_id, name, department, gender } = req.body
            let newInfo = { name, gender, department }
            await Teacher.teacherUpdate(newInfo, { where: { user_id } }).then(result => {
                res.json(RESULT.SUCCESS)
            }).catch(e => {
                console.log('error', e)
                res.json(RESULT.INTERNAL_ERROR)
            })
        } else {
            res.json({ code: 40000, msg: "管理员不能修改哦～" })
        }

    }




}

const userController = new user();
export default userController