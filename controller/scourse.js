import { Enrollment, Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, where } from "sequelize";
import { RESULT } from "../utils/constant.js";

import { Teacher, Course, SCourse, SCourse_view, Scourse_students_view } from "../db/sql.js";

class scourse {
    constructor() { }

    // 添加选课项
    async createSCourse(req, res, next) {
        const { course_id, teacher_id, day, time } = req.body

        const teacher = await Teacher.findOne({ where: { teacher_id } })

        if (!teacher) {
            res.json(RESULT.TEACHER_NOT_EXIST)
            return
        }
        const course = await Course.findOne({ where: { course_id } })
        if (!course) {
            res.json(RESULT.COURSE_NOT_EXIST)
            return
        }



        SCourse.create({ course_id, teacher_id, day, time }).then(result => {
            res.json(RESULT.CREATE_SUCCESS)
        }).catch(err => {
            console.log("err", err)
            if (err.name == 'SequelizeUniqueConstraintError') {
                res.json(RESULT.EXIST_SCOURSE)
            } else {
                res.json(RESULT.INTERNAL_ERROR)
            }


        })



    }

    // 获取所有选课项
    async findSCourse(req, res, next) {
        let { keyword, pageSize, pageNum } = req.query
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)

        const offset = ((pageNum - 1) || 0) * (pageSize || 10); // 确保正确计算偏移量
        const limit = pageSize || 10;

        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    course_name: {
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
            const result = await SCourse_view.findAndCountAll({
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['scourse_id', 'ASC']] // 按创建时间降序排序
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

    // 删除选课
    async deleteCourse(req, res, next) {
        const { ids } = req.body
        const result = await SCourse.destroy({ where: { scourse_id: ids } })
        if (result > 0) {
            res.json({ ...RESULT.DELETE_SUCCESS, data: result })
        } else {
            res.json(RESULT.OP_ERROR)
        }

    }


    // 查询选这门课的学生
    async findStudentsByScourseId(req, res, next) {
        let { keyword, pageSize, pageNum, scourse_id } = req.query
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        scourse_id = Number(scourse_id)

        const offset = ((pageNum - 1) || 0) * (pageSize || 10); // 确保正确计算偏移量
        const limit = pageSize || 10;
        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                {
                    student_id: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};
        if (scourse_id) whereCondition['scourse_id'] = scourse_id


        try {
            const result = await Scourse_students_view.findAndCountAll({
                attributes: ["enrollment_id", "student_id", "name", "gender", "grade", "major", "score"],
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['student_id', 'ASC']] // 按创建时间降序排序
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

    // 修改某个学生某门课成绩
    async updateScore(req, res, next) {
        let { enrollment_id, score } = req.body
        try {
            await Enrollment.update({ grade: score }, {
                where: { enrollment_id }
            })
            res.json(RESULT.UPDATE_SUCCESS)
        }catch(e){
            console.log('e',e)
            res.json(RESULT.OP_ERROR)
        }
    }
}
const SCourseController = new scourse()
export default SCourseController