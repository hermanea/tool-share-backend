const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Tool, Type, } = require("../models");
const jwt = require("jsonwebtoken");

// Signup user 
router.post("/", (req, res) => {
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })
    .then((newUser) => {
        const token = jwt.sign(
            {
                username: newUser.username,
                id: newUser.id,
            },
            process.env.JWT_SECRET,
            {
                expireIn: "12hr",
            }
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
            {
                expiresIn: "12h",
            }
        );
        res.json({
            token,
            user: userData,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status({ msg: "Error.", err })
    });
});
 
router.get("/isValidToken", (req, res) => {
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

// Get user with their shares.
router.get("/:id", (req, res) => {
    User.findByPk(req.params.id, {
        include: [Share],
    })
    .then(userData=>{
        res.json(userData)
    })
    .catch((err) => {
        console.log(err);
        res.json({ msg: "Error.", err });
    });
});

// Get user with their tools.
router.get("/:id", (req, res) => {
    User.findByPk(req.params.id, {
        include: [Tool],
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