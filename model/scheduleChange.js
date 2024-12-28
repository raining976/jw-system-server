export default function (sequelize, DataTypes) {

    const ScheduleChange = sequelize.define('ScheduleChange', {
        change_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        scourse_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        detail: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('申请中', '同意', '拒绝'),
            defaultValue: '申请中'
        },
        requested_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'schedule_changes',
        timestamps: false
    });
    
    // 外键关联
    ScheduleChange.associate = (models) => {
        ScheduleChange.belongsTo(models.SCourse, {
            foreignKey: 'scourse_id',
            onDelete: 'CASCADE'
        });
        ScheduleChange.belongsTo(models.Teacher, {
            foreignKey: 'teacher_id',
            onDelete: 'CASCADE'
        });
    };

    return ScheduleChange;
}



