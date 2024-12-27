export default function (sequelize, DataTypes) {
    const student_courses_view = sequelize.define('Student_courses_view', {
        enrollment_id:DataTypes.INTEGER,
        grade:DataTypes.DECIMAL(5, 2),
        username: DataTypes.STRING,
        course_id: DataTypes.INTEGER,
        scourse_id: DataTypes.INTEGER,
        teacher_id:DataTypes.INTEGER,
        teacher_name:DataTypes.STRING,
        day: DataTypes.STRING,
        time:DataTypes.STRING
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'student_courses_view', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return student_courses_view
}