import express from "express"
import TeacherController from "../controller/teacher.js"
import AuthController from "../controller/auth.js"

const router = express.Router()

router.post('/register', TeacherController.createTeacher)

router.get('/findMyClass', TeacherController.findMyCourse)
router.use(AuthController.verifyIsAdmin)
router.post('/update', TeacherController.updateTeacher)
router.get('/find', TeacherController.findTeacher)
router.post('/add',TeacherController.addTeacher)

export default router