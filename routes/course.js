import express from "express"
import courseController from "../controller/course.js"
import authController from '../controller/auth.js'
const router = express.Router()


router.use(authController.verifyIsAdmin)
router.post('/add', courseController.createCourse)
router.post('/update',courseController.updateCourse)
router.get('/find', courseController.findCourse)
router.post('/delete', courseController.deleteCourses)
export default router