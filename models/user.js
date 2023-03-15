const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         validate:{
            isEmail:true
         }
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            len:[8]
        }
    }
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
    hooks:{
        beforeCreate: (userObj) =>{
            userObj.password = bcrypt.hashSync(userObj.password,5);
            return userObj;
        }
    }
});

module.exports= User
