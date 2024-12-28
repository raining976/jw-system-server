export default function (sequelize, DataTypes) {
    const Stu_change_view = sequelize.define('Stu_change_view', {
        username: DataTypes.STRING,
        change_id: DataTypes.INTEGER,
        scourse_id: DataTypes.INTEGER,
        teacher_id: DataTypes.INTEGER,
        detail: DataTypes.STRING,
        reason: DataTypes.STRING,
        status: DataTypes.STRING,
        requested_at: DataTypes.STRING,
        course_name: DataTypes.STRING,
        day: DataTypes.STRING,
        time: DataTypes.STRING
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'student_change_notifications', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return Stu_change_view
}