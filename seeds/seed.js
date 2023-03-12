const sequelize = require('../config/connection');
const { User, Tool, Type, Share } = require('../models');

const users = [
    {
        email:"evan@evan.com",
        username:"evan",
        password:"evanpassword"
    },
    {
        email:"andrew@andrew.com",
        username:"andrew",
        password:"andrewpassword"
    }
];

const types = [
    {
        categoryname:"Saw"
    },
    {
        categoryname:"Drill"
    },
    {
        categoryname:"Sander"
    }
];

const shares = [
    {
        date: new Date(),
        notes: "borrow request",
        borrowed_by: 1,
        tool_id: 2,
        owner_id: 2
    },
    {
        date: new Date(),
        notes: "borrow request",
        borrowed_by: 2,
        tool_id: 1,
        owner_id: 1
    }
];

const tools = [
    {
        toolname: "Makita Impact 18v",
        description: "",
        type_id: 2,
        owner_id: 1
    },
    {
        toolname: "Festool Oscillating Sander",
        description: "",
        type_id: 3,
        owner_id: 2
    }
];

const seed = async () => {
    await sequelize.sync({ force: true });
    const seededUsers = await User.bulkCreate(users, {
      individualHooks: true,
    });
    const seededTypes = await Type.bulkCreate(types);
    const seededTools = await Tool.bulkCreate(tools);
    const seededShares = await Share.bulkCreate(shares);
    process.exit(0);
  };

seed();