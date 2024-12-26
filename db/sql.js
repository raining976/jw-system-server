import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'jw-system-db',
    'root',
    'admin123',
    {
        dialect: 'mysql',  // 数据库类型
        host: 'localhost',   // 数据库地址，本人用的是百度云的数据库
        port: '3306', // 端口号
        logging: console.log,
    }
)

import UserModel from "../model/user.js"
import CourseModel from "../model/course.js"
import StudentModel from "../model/student.js"
import TeacherModel from "../model/teacher.js"
import SCourseModel from "../model/scourse.js"
import SCourse_view_model from '../model/scourse_view.js';

const Course = CourseModel(sequelize, DataTypes)
const SCourse = SCourseModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
const Student = StudentModel(sequelize, DataTypes)
const Teacher = TeacherModel(sequelize, DataTypes)

// 视图
const SCourse_view = SCourse_view_model(sequelize,DataTypes)


// 进行模型关联
User.hasOne(Teacher, { foreignKey: 'user_id' , as:'teacher'});
User.hasOne(Student, { foreignKey: 'user_id' , as:'student'});



// 在应用启动时添加 // caution!force如果是true的话每次启动都会先删除表后创建表
sequelize.sync({ force: false, alter: true }).then(() => {
    console.log("数据库表同步完成");
}).catch(err => {
    console.log("数据库同步失败: ", err);
});

//测试数据库链接
sequelize.authenticate().then(function () {
    console.log("数据库连接成功");
}).catch(function (err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});


export { sequelize, Sequelize, Student, User, Teacher , Course, SCourse ,SCourse_view}