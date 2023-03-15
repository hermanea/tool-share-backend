const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Share extends Model {}

Share.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    notes:{
        type:DataTypes.TEXT,
        allowNull: true,
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    Borrower_Id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    Tool_Id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tool',
            key: 'id',
        },
    },
    Lender_Id: {
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
    modelName: 'Share',
});

module.exports= Share;