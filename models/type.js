const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Type extends Model {}

Type.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    typename: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[1]
        }   
    }
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Type',
});

module.exports= Type;