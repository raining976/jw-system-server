export default function (sequelize, DataTypes) {
    const Teacher = sequelize.define('Teacher', {
        teacher_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('男', '女', '保密'),
            defaultValue: '保密',
        },
        department: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'teachers', // 表名
        timestamps: false      // 禁用 `createdAt` 和 `updatedAt`
    });

    // 设置外键关联
    Teacher.associate = (models) => {
        Teacher.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };


    Teacher.teacherCreate = value => Teacher.create(value);
    Teacher.teacherUpdate = (value, options) => Teacher.update(value,options);
    Teacher.teacherFindOne = options => Teacher.findOne(options)
    Teacher.teacherFind = options => Teacher.findAllAndCount(options)

    return Teacher;
}



