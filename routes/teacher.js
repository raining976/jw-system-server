import express from "express"
import TeacherController from "../controller/teacher.js"
import AuthController from "../controller/auth.js"

const router = express.Router()

router.post('/register', TeacherController.createTeacher)

router.use(AuthController.verifyIsAdmin)
router.post('/update', TeacherController.updateTeacher)

export default router