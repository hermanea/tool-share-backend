const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tool extends Model {}

Tool.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    toolname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len:[1]
        },  
    },
    description: {
         type: DataTypes.TEXT,
         allowNull:true,
         validate:{
            len:[1]
        },
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    Type_Id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Type',
            key: 'id',
        },
    },
    Owner_Id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
        },
    },
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Tool',
});

module.exports = Tool;