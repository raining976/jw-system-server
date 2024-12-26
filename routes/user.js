import express from "express"
import UserController from "../controller/user.js"
import AuthController from "../controller/auth.js"
const router = express.Router()

// 所有用户
router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.get('/info', UserController.getMyInfo)
router.post('/updateMe',UserController.updateMyInfo)

router.use(AuthController.verifyIsAdmin)
router.get('/getAll', UserController.getAllUser)
router.post('/delete', UserController.deleteUsers)


export default router