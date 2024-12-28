import express from "express"
import ScheduleChange from "../controller/scheduleChange.js"
import AuthController from "../controller/auth.js"
const router = express.Router()



router.post('/create', ScheduleChange.createScheduleChange)
router.get('/teacherFind', ScheduleChange.teacherFind)
router.get('/studentFind', ScheduleChange.studentFind)
router.get('/adminFind', ScheduleChange.adminFind)
router.use(AuthController.verifyIsAdmin)

router.post('/delete', ScheduleChange.deleteChange)
router.post('/approve', ScheduleChange.approveChange)
router.post('/reject', ScheduleChange.rejectChange)




export default router