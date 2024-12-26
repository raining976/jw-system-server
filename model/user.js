import { Sequelize } from "sequelize";
export default function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            validator: {
                notNull: {
                    msg: "学号不能为空"
                },
            }
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validator: {
                notNull: {
                    msg: "用户名不能为空"
                },
                len: [5, 50],
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validator: {
                notNull: {
                    msg: "密码不能为空"
                },
                len: [6, 30]
            }
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher', 'admin'),
            allowNull: false,
            validator: {
                notNull: {
                    msg: "角色不能为空"
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users', // 表名
        timestamps: false   // 禁用自动创建的 `createdAt` 和 `updatedAt`
    });



    /**
         * 创建用户
         * @param {*} value 用户信息对象 
         * @returns 
         */
    User.userCreate = value => {
        return User.create(value);
    }

    /**
     * 查询符合条件的第一个用户（查询全部用户使用： User.findAll）
     * @param options 查询用户条件
     * @returns Promise
     */
    User.userFindOne = options => {
        return User.findOne(options)
    }

    User.userFind = options => User.findAndCountAll(options);

    /**
     *更新用户信息
     * @param value 更新为此数据
     * @param options 更新数据条件（更新哪一条）
     * @returns Promise
     */
    User.userUpdate = (value, options) => {
        return User.update(value, options)
    }

    /**
     * 删除用户
     * @param options 删除条件（删除哪一条）
     * @returns Promise
     */
    User.userDelete = options => {
        return User.destroy(options)
    }

    return User
}
