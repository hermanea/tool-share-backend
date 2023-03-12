const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tool extends Model {}

Tool.init({
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[1]
        }   
    },
    description: {
         type: DataTypes.TEXT,
         allowNull:true,
         validate:{
            len:[1]
        }   
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    sequelize,
});

module.exports= Tool