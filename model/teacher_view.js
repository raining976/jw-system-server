export default function (sequelize, DataTypes) {
    const teacher_view = sequelize.define('scourse_view', {
        user_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        role: DataTypes.STRING,
        teacher_id: DataTypes.INTEGER,
        teacher_name: DataTypes.STRING,
        gender: DataTypes.STRING,
        department: DataTypes.STRING,
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'teacher_view', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return teacher_view
}