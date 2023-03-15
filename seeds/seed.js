const sequelize = require('../config/connection');
const { User, Tool, Type, Share } = require('../models');

const users = [
    {
        username:"evan",
        email:"evan@evan.com",
        password:"evanpassword",
    },
    {
        username:"andrew",
        email:"andrew@andrew.com",
        password:"andrewpassword",
    }
];

const types = [
    {
        typename:"Saw",
    },
    {
        typename:"Drill",
    },
    {
        typename:"Sander",
    }
];

const shares = [
    {
        date: new Date(),
        notes:"",
        Borrower_Id: 1,
        Tool_Id: 2,
        Lender_Id: 2
    },
    {
        date: new Date(),
        notes:"",
        Borrower_Id: 2,
        Tool_Id: 1,
        Lender_Id: 1
    }
];

const tools = [
    {
        toolname: "Makita Impact 18v",
        description: "",
        Type_Id: 2,
        Owner_Id: 1
    },
    {
        toolname: "Festool Oscillating Sander",
        description: "",
        Type_Id: 3,
        Owner_Id: 2
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