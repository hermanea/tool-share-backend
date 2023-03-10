const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class tool extends Model {}

tool.init({
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
    },
    type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Type',
            key: 'id',
        },
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },


},{
    sequelize,
});

module.exports=tool