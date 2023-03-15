const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Tool, Share, Type } = require("../models");
const jwt = require("jsonwebtoken");

// Signup user 
router.post("/", (req, res) => {
  console.log(req.body);
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
    .then((newUser) => {
        const token = jwt.sign(
            {
                username: newUser.username,
                id: newUser.id,
            },
            process.env.JWT_SECRET,
        );
        res.json({
            token,
            user: newUser,
        });
    })
    .catch((err) => {
        console.log(err);
        res.json({ msg:"Error.", err })
    });
});

// Login User
router.post("/login", (req, res) => {
    User.findOne({
        where:{
            email: req.body.email,
        },
    })
    .then((userData) => {
        if(!userData) {
            return res.status(401).json({ msg: "Incorrect user information." });
        }
        if (!bcrypt.compareSync(req.body.password, userData.password)) {
            return res.status(401).json({ msg: "Incorrect user information." });
        }
        const token = jwt.sign(
            {
                username: userData.username,
                id: userData.id
            },
            process.env.JWT_SECRET,
        );
        res.json({
            token,
            user: userData,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Error.", err })
    });
});

// Auth.
router.get("/auth/isValidToken", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if(!token) {
        return res.status(403).json({ isValid: false, msg: "Please login to request a tool!"});
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isValid: true, user: tokenData,});
    } catch (err) {
        console.log(err);
        res.status(403).json({ isValid: false, msg: "Invalid Token.", });
    }
});

// get all users
router.get("/", (req, res) => {
    User.findAll({
        include: [
            {
              model: Share,
              as: 'SharesAsBorrower',
              include: [
                {
                  model: Tool,
                  include: [
                    {
                      model: Type,
                    },
                    {
                      model: User,
                      as: 'Owner',
                    },
                    {
                      model: Share,
                      include: [
                        {
                          model: User,
                          as: 'Borrower',
                        },
                        {
                          model: User,
                          as: 'Lender',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: Share,
              as: 'SharesAsLender',
              include: [
                {
                  model: Tool,
                  include: [
                    {
                      model: Type,
                    },
                    {
                      model: User,
                      as: 'Owner',
                    },
                    {
                      model: Share,
                      include: [
                        {
                          model: User,
                          as: 'Borrower',
                        },
                        {
                          model: User,
                          as: 'Lender',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        })
    .then(userData=>{
        res.json(userData)
    })
    .catch((err) => {
        console.log(err);
        res.json({ msg: "Error.", err });
    });
});


// Find one user.
router.get("/:id", (req, res) => {
    User.findByPk(req.params.id, {
        include: [
          {
            model: Share,
            as: 'SharesAsBorrower',
            include: [
              {
                model: Tool,
                include: [
                  {
                    model: Type,
                  },
                  {
                    model: User,
                    as: 'Owner',
                  },
                  {
                    model: Share,
                    include: [
                      {
                        model: User,
                        as: 'Borrower',
                      },
                      {
                        model: User,
                        as: 'Lender',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Share,
            as: 'SharesAsLender',
            include: [
              {
                model: Tool,
                include: [
                  {
                    model: Type,
                  },
                  {
                    model: User,
                    as: 'Owner',
                  },
                  {
                    model: Share,
                    include: [
                      {
                        model: User,
                        as: 'Borrower',
                      },
                      {
                        model: User,
                        as: 'Lender',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
    })
    .then(userData=>{
        res.json(userData)
    })
    .catch((err) => {
        console.log(err);
        res.json({ msg: "Error.", err });
    });
});

 
module.exports = router;