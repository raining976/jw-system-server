export default function (sequelize, DataTypes) {
    const admin_change_view = sequelize.define('admin_change_view', {
        change_id: DataTypes.INTEGER,
        scourse_id: DataTypes.INTEGER,
        teacher_id: DataTypes.INTEGER,
        teacher_name: DataTypes.STRING,
        detail: DataTypes.STRING,
        reason: DataTypes.STRING,
        status: DataTypes.STRING,
        requested_at: DataTypes.STRING
    }, {
        timestamps: false, // 视图通常没有时间戳
        tableName: 'admin_change_notifications', // 视图的名称
        freezeTableName: true, // 禁用模型名称的复数化
        underscored: true // 使用下划线命名规则
    });

    return admin_change_view;
}