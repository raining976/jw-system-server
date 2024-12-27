import express from "express"
import authController from '../controller/auth.js'
import SCourseController from "../controller/scourse.js"
const router = express.Router()

router.get('/find', SCourseController.findSCourse)


router.use(authController.verifyIsAdmin)
router.post('/add', SCourseController.createSCourse)
router.post('/delete', SCourseController.deleteCourse)

export default router