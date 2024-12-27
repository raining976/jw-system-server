import express from "express"
import StudentController from "../controller/student.js"
import AuthController from "../controller/auth.js"

const router = express.Router()

router.post('/register', StudentController.createStudent)
router.post('/chooseCourse', StudentController.choseCourse)
router.get('/findMyCourse', StudentController.findMyCourse)
router.post('/cancelCourse', StudentController.cancelCourse)


router.use(AuthController.verifyIsAdmin)

router.post('/update', StudentController.updateStudent)
router.get('/find', StudentController.findStudent)
router.post('/add', StudentController.addStudent)


export default router