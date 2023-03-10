const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Type extends Model {}

Type.init({
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[1]
        }   
    }
},{
    sequelize,
});

module.exports= Type;