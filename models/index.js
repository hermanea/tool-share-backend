const User = require("./User");
const Tool = require("./Tool");
const Type = require("./Type");
const Share = require("./Share");

Tool.belongsTo(User,{
    onDelete:"CASCADE",
    as: 'Owner',
    foreignKey: 'Owner_Id'
});

User.hasMany(Tool)

Tool.belongsTo(Type,{
    onDelete:"CASCADE",
    foreignKey: "Tool_Id"
});

Type.hasMany(Tool)

User.belongsTo(Share,{
    as: 'Owner',
    foreignKey: 'Owner_Id'
});

User.belongsTo(Share, {
    as: 'Borrower',
    foreignKey: 'Borrower_Id'
});

Tool.belongsTo(Share, {
    foreignKey: 'Tool_Id'
})

User.hasMany(Share)

module.exports = {
    User,
    Tool,
    Type,
    Share
}