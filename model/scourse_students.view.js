export default function (sequelize, DataTypes) {
    const scourse_students_view = sequelize.define('Scourse_students_view', {
        enrollment_id: DataTypes.INTEGER,
        scourse_id:DataTypes.INTEGER,
        score:DataTypes.DECIMAL(5, 2),
        student_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        grade:DataTypes.STRING,
        gender: DataTypes.STRING,
        major:DataTypes.STRING
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'scourse_students_view', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return scourse_students_view
}