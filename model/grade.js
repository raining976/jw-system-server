export default function (sequelize, DateTypes) {
    const Grade = sequelize.define('Grade', {
        grade_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grade: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        graded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'grades',
        timestamps: false
    });
    
    // 设置外键关联
    Grade.associate = (models) => {
        Grade.belongsTo(models.Enrollment, {
            foreignKey: 'enrollment_id',
            onDelete: 'CASCADE'
        });
        Grade.belongsTo(models.Teacher, {
            foreignKey: 'teacher_id',
            onDelete: 'CASCADE'
        });
    };

    return Grade

}


