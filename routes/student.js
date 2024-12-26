import express from "express"
import StudentController from "../controller/student.js"
import AuthController from "../controller/auth.js"

const router = express.Router()

router.post('/register', StudentController.createStudent)
router.use(AuthController.verifyIsAdmin)

router.post('/update', StudentController.updateStudent)


export default router