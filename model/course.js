export default function (sequelize, DataTypes) {
    const Course = sequelize.define('Course', {
        course_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'courses',
        timestamps: false,
    });

    Course.courseCreate = value => Course.create(value)
    Course.courseFindAll = (options) => Course.findAndCountAll(options)
    Course.courseUpdate = (value,options) => Course.update(value,options)
    Course.courseDestroy = (options) => Course.destroy(options)

    return Course;

}