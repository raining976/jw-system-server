export default function (sequelize, DataTypes) {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            validator: {
                notNull: {
                    msg: "学号不能为空"
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validator: {
                notNull: {
                    msg: "用户ID不能为空"
                }
            },
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validator: {
                notNull: {
                    msg: "姓名不能为空"
                }
            }
        },
        gender: {
            type: DataTypes.ENUM('男', '女', '保密'),
            defaultValue: '保密',
        },
        major: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validator: {
                notNull: {
                    msg: "专业不能为空"
                }
            }
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validator: {
                notNull: {
                    msg: "年级不能为空"
                }
            }
        }
    }, {
        tableName: 'students', // 表名
        timestamps: false      // 禁用 `createdAt` 和 `updatedAt`
    });

    // 设置外键关联
    Student.associate = (models) => {
        Student.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };

    Student.studentCreate = value => Student.create(value);
    Student.studentUpdate = (value,options) => Student.update(value,options);
    Student.studentFindOne = options => Student.findOne(options)


    return Student;

}



