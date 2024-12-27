export default function (sequelize, DataTypes) {
    const student_view = sequelize.define('scourse_view', {
        user_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        user_id: DataTypes.INTEGER,
        role: DataTypes.STRING,
        student_id: DataTypes.INTEGER,
        student_name: DataTypes.STRING,
        gender: DataTypes.STRING,
        major: DataTypes.STRING,
        grad: DataTypes.INTEGER
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'student_view', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return student_view
}