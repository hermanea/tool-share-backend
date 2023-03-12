const express = require("express");
const router = express.Router();
const { Share, User, Tool } = require("../models");
const jwt = require("jsonwebtoken");

// Get all share requests.
router.get("/", (req, res) => {
    Share.findAll({
      include: [
        { 
          model: User,
          as: 'Borrower'
        },
        {
          model: User,
          as: 'Owner',
        },
        { 
          model: Tool,
        }
      ],
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
        confirmed: false,
        borrowed_by: tokenData.Id,
        tool_id: Tool.id,
        owner_id: Tool.Owner_Id
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

// Update share request so owner can change boolean to true.
router.put('/shares/:id', async (req, res) => {
    try {
      const share = await Share.findByPk(req.params.id);
      if (!share) {
        res.status(404).json({ error: 'Share not found.' });
        return;
      }
      share.confirmed = true;
      await share.save();
      res.json(share);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;