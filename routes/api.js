import user from "./user.js"

import { appType, token } from "./headers.js"
import student from "./student.js"
import teacher from "./teacher.js"
import course  from "./course.js"
import scourse from "./scourse.js"
import scheduleChange from "./scheduleChange.js"

export default app =>{
    // app.use(appType)
    app.use(token)
    app.use('/teacher', teacher)
    app.use('/student', student)
    app.use('/course', course)
    app.use('/user', user)
    app.use('/scourse', scourse)
    app.use('/scheduleChange', scheduleChange)
    
}