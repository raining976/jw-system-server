export default function (sequelize, DataTypes) {
    const Enrollment = sequelize.define('Enrollment', {
        enrollment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        instance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grade: {
            type: DataTypes.DECIMAL(5, 2),
        },
    }, {
        tableName: 'enrollments',
        timestamps: false,
    });

    // 外键关联
    Enrollment.associate = (models) => {
        Enrollment.belongsTo(models.CourseInstance, { foreignKey: 'instance_id', onDelete: 'CASCADE' });
        Enrollment.belongsTo(models.Student, { foreignKey: 'student_id', onDelete: 'CASCADE' });
    };

    return Enrollment;
}