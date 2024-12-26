export default function (sequelize, DateTypes) {

    const ScheduleChange = sequelize.define('ScheduleChange', {
        change_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        original_schedule: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        requested_schedule: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
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
        ScheduleChange.belongsTo(models.Course, {
            foreignKey: 'course_id',
            onDelete: 'CASCADE'
        });
        ScheduleChange.belongsTo(models.Teacher, {
            foreignKey: 'teacher_id',
            onDelete: 'CASCADE'
        });
    };

    return ScheduleChange;
}



