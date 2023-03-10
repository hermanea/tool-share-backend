const express = require("express");
const router = express.Router();
const { Share, User, } = require("../models");
const jwt = require("jsonwebtoken");

// Get all share requests.
router.get("/", (req, res) => {
    Share.findAll({
      include: [User],
    })
      .then((allShares) => {
        res.json(allShares);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Error.", err });
      });
});

// Create share request.
router.post("/", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to requeset a tool!" });
    }
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      Share.create({
        date: req.body.date,
        notes: req.body.notes,
        borrowed_by: tokenData.id,
        tool_Id: req.body.toolId,
        owner_Id: req.body.ownerId
      })
        .then((newShare) => {
            res.json(newShare);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ msg: "Error.", err });
        });
    } catch (err) {
      return res.status(403).json({ msg: "Invalid Token." });
    }
});