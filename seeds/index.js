const sequelize = require('../config/connection');
const { User, Type } = require('../models');

const users = [
    {
        username:"",
        email:"",
        password:""
    },
    {
        username:"",
        email:"",
        password:""
    },
    {
        username:"",
        email:"",
        password:""
    },
];

const types = [
    {
        categoryname:""
    },
    {
        categoryname:""
    },
    {
        categoryname:""
    },
    {
        categoryname:""
    }, 
    {
        categoryname:""
    },
];

const shares = [
    {
        date: "",
        notes: "",
        UserId:
    },
    {
        date: "",
        notes: "",
        UserId:
    },
    {
        date: "",
        notes: "",
        UserId:
    },
];

const seed = async () => {
    await sequelize.sync({ force: true });
    const seededUsers = await User.bulkCreate(users, {
      individualHooks: true,
    });
    const seededShares = await Share.bulkCreate(shares);
    process.exit(0);
  };

seed();