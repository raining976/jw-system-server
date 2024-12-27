export default function (sequelize, DataTypes) {
    const CourseInstance = sequelize.define('SCourse', {
        scourse_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        day: {
            type: DataTypes.ENUM('周一', '周二', '周三', '周四', '周五'),
            allowNull: false,
        },
        time: {
            type: DataTypes.ENUM('上午12节', '上午34节', '下午56节', '下午78节'),
            allowNull: false,
        },
    }, {
        tableName: 'scourse',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['teacher_id', 'day', 'time'], // 设置唯一约束的字段组合
            },
        ],
    },
    );


    // 外键关联
    CourseInstance.associate = (models) => {
        CourseInstance.belongsTo(models.Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
        CourseInstance.belongsTo(models.Teacher, { foreignKey: 'teacher_id', onDelete: 'CASCADE' });
    };



    return CourseInstance;
}