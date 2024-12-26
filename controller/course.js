import { Sequelize, sequelize } from "../db/sql.js";
import { DataTypes, where } from "sequelize";

import CourseModel from '../model/course.js'
import { RESULT } from "../utils/constant.js";
const Course = new CourseModel(sequelize, DataTypes)


class course {
    constructor() { }
    // 添加新课
    async createCourse(req, res, next) {

        const { course_name, description } = req.body

        let value = { course_name, description }
        await Course.courseCreate(value).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 模糊搜索 分页
    async findCourse(req, res, next) {
        let { pageSize, pageNum, keyword } = req.query;
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
                    description: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};

        try {
            const result = await Course.findAndCountAll({
                attributes: ['course_id', 'course_name', 'description', 'created_at', 'updated_at'], // 返回课程的ID、名称、描述
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['course_id', 'ASC']] // 按创建时间降序排序
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

    // 更新课程
    async updateCourse(req, res, next) {
        const { course_id, course_name, description } = req.body

        Course.courseUpdate({ course_name, description }, { where: { course_id } }).then(result => {
            res.json(RESULT.SUCCESS)
        }).catch(e => {
            console.log('e', e)
            res.json(RESULT.INTERNAL_ERROR)
        })
    }

    // 删除 传入的参数是course_id数组
    async deleteCourses(req, res, next) {
        const { ids } = req.body
        const result = await Course.destroy({ where: { course_id: ids } })

        if (result > 0) {
            res.json({ ...RESULT.SUCCESS, data: result })
        } else {
            res.json(RESULT.INTERNAL_ERROR)
        }
    }
}

const CourseController = new course()
export default CourseController