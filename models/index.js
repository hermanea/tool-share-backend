const User = require("./user");
const Tool = require("./tool");
const Type = require("./type");
const Share = require("./share");

User.hasMany(Tool, {
    onDelete:"CASCADE",
});
Tool.belongsTo(User, {
    foreignKey: 'Owner_Id',
    as: 'Owner'
});

Type.hasMany(Tool);
Tool.belongsTo(Type, {
    foreignKey: "Type_Id"
});

User.hasMany(Share, {foreignKey: 'Borrower_Id', as: 'SharesAsBorrower' });
User.hasMany(Share, {foreignKey: 'Lender_Id', as: 'SharesAsLender' });

Tool.hasMany(Share, { foreignKey: 'Tool_Id'});

Share.belongsTo(User, { foreignKey: 'Borrower_Id', as: 'Borrower' });
Share.belongsTo(User, { foreignKey: 'Lender_Id', as: 'Lender' });
Share.belongsTo(Tool, { foreignKey: 'Tool_Id' });

module.exports = {
    User,
    Tool,
    Type,
    Share
}