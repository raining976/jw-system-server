export default function (sequelize, DataTypes) {
    const SCourse_view = sequelize.define('scourse_view', {
        scourse_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        course_id: DataTypes.INTEGER,
        teacher_id: DataTypes.INTEGER,
        day: DataTypes.STRING,
        time: DataTypes.STRING,
        course_name: DataTypes.STRING,
        teacher_name: DataTypes.STRING
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'scourse_view', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return SCourse_view
}
