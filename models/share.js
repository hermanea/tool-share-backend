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
    borrowed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
    tool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tool',
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
    sequelize
});

module.exports= Share