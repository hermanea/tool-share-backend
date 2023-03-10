const User = require("./user");
const Tool = require("./tool");
const Type = require("./type");
const Share = require("./share");

Tool.belongsTo(User,{
    onDelete:"CASCADE",
    as:'owner',
    foreignKey: {
        allowNull: false
    }
});

Tool.belongsTo(User, {
    onDelete:"CASCADE",
    as:'borrower'
});

Tool.belongsTo(Type,{
    onDelete:"CASCADE"
});

Type.hasmany(Tool)

User.belongsTo(Share,{
    onDelete:"CASCADE",
    as:'lender',
    foreignKey: {
        allowNull: false
    }
});

User.belongsTo(Share, {
    onDelete:"CASCADE",
    as:'borrower'
});

module.exports = {
    User,
    Tool,
    Type,
    Share
}