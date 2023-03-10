const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class tool extends Model {}

book.init({
    toolname:{
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
    }
},{
    sequelize,
});

module.exports=tool