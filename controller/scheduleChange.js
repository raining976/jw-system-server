import { User, ScheduleChange, Teacher_view, Stu_change_view, Admin_change_view } from "../db/sql.js";
import { Sequelize, where } from "sequelize";
import { RESULT } from "../utils/constant.js";




class scheduleChange {
    constructor() { }

    // 创建调课申请
    async createScheduleChange(req, res, next) {
        let { scourse_id, teacher_id, reason, detail } = req.body

        try {
            let isCreated = await ScheduleChange.create({ scourse_id, teacher_id, reason, detail })
            if (isCreated) {
                res.json(RESULT.APPLY_SUCCESS)
                return
            }
        } catch (e) {
            console.log('e', e)
            res.json(RESULT.OP_ERROR)
        }

    }

    // 学生查调课申请
    async studentFind(req, res, next) {
        // res.json({code:20000,msg:'接口开发中。。。'})
        let { username } = req.decoded
        try {
            let result = await Stu_change_view.findAndCountAll({
                where: { username, status: '同意' },
                attributes: [
                    "username",
                    "change_id",
                    "scourse_id",
                    "teacher_id",
                    "detail",
                    "reason",
                    "status",
                    "requested_at",
                    "course_name",
                    "day",
                    "time"
                ]
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

    // 老师查调课申请
    async teacherFind(req, res, next) {
        console.log('req', req.query)
        let { username } = req.decoded
        let teacher_id
        let teacher = await Teacher_view.findOne({ where: { username }, attributes: ['teacher_id'] })
        if (teacher) teacher_id = teacher.teacher_id
        else {
            res.json(RESULT.USER_NOT_EXIST)
            return
        }

        try {
            let result = await ScheduleChange.findAndCountAll({ where: { teacher_id } })

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

    // 管理员查看所有调课申请
    async adminFind(req, res, next) {

        let { pageSize, pageNum, keyword, status } = req.query;
        pageSize = Number(pageSize)
        pageNum = Number(pageNum)
        const offset = ((pageNum - 1) || 0) * (pageSize || 10); // 确保正确计算偏移量
        const limit = pageSize || 10;

        // 构造查询条件
        const whereCondition = keyword ? {
            [Sequelize.Op.or]: [
                {
                    teacher_name: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                {
                    reason: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                },
                {
                    detail: {
                        [Sequelize.Op.like]: `%${keyword}%`
                    }
                }
            ]
        } : {};

        if (status) whereCondition['status'] = status

        try {
            const result = await Admin_change_view.findAndCountAll({
                attributes: ["change_id", "scourse_id", "teacher_id", "teacher_name", "detail", "reason", "status", "requested_at"],
                where: whereCondition,
                offset: offset,
                limit: limit,
                order: [['change_id', 'ASC']] // 按创建时间降序排序
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


    // 管理员删除调课申请
    async deleteChange(req, res, next) {
        let { ids } = req.body
        let result = await ScheduleChange.destroy({ where: { change_id: ids } })
        if (result > 0) {
            res.json({ ...RESULT.DELETE_SUCCESS, data: result })
        } else {
            res.json(RESULT.OP_ERROR)
        }
    }


    // 管理员同意调课申请
    async approveChange(req, res, next) {
        let { change_id } = req.body

        let result = await ScheduleChange.update({ status: "同意" },{ where: { change_id } })
        if (result) {
            res.json({ ...RESULT.SUCCESS, data: result })
        } else {
            res.json(RESULT.OP_ERROR)
        }
    }

    // 拒绝申请
    async rejectChange(req, res, next) {
        let { change_id } = req.body

        let result = await ScheduleChange.update({ status: "拒绝" }, { where: { change_id } } )
        if (result) {
            res.json({ ...RESULT.SUCCESS, data: result })
        } else {
            res.json(RESULT.OP_ERROR)
        }
    }
}

const ScheduleChangeController = new scheduleChange()

export default ScheduleChangeController
