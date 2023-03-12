const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Share extends Model {}

Share.init({
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    notes:{
        type:DataTypes.TEXT,
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize
});

module.exports= Share