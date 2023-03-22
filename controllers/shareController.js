const express = require("express");
const router = express.Router();
const { Share, User, Tool, Type } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

// Get all shares with User
router.get("/", (req, res) => {
    Share.findAll({
      include: [
        { 
          model: User,
          as: 'Borrower'
        },
        {
          model: User,
          as: 'Lender',
        },
        { 
          model: Tool,
          include: [
            {
              model: User,
              as: 'Owner'
            },
          ]
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

// Get all logged in user's shares
router.get("/userShares", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log("Token received in the backend:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
      if (!token) {
        return res.status(403).json({ msg: "Please login to view your shares." });
      }
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token data:", tokenData);
      Share.findAll({
        where: { 
          [Op.or]: [
            { Borrower_Id: tokenData.id },
            { Lender_Id: tokenData.id }
          ]
        },
        include: [
          {
            model: User,
            as: 'Borrower'
          },
          {
            model: User,
            as: 'Lender'
          },
          {
            model: Tool,
            include: [
              {
                model: User,
                as: 'Owner'
              },
            ],
          },
        ],
      }).then((userShares) => {
        console.log('Fetched userShares:', JSON.stringify(userShares, null, 2));
        res.json(userShares);
      }).catch((err) => {
        console.error("Error in userShares route:", err);
        res.status(500).json({ msg: "Error.", err });
    });
    } catch (err) {
      return res.status(403).json({ msg: "Invalid Token." });
    }
});

// Get share by id, with model data
router.get("/:id", (req, res) => {
  Share.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'Borrower'
      },
      {
        model: User,
        as: 'Lender'
      },
      {
        model: Tool,
        include: [
          {
            model: User,
            as: 'Owner'
          },
        ],
      },
    ],
  })
    .then((share) => {
      res.json(share);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Error.", err });
    });
});

// Create share request
router.post("/", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to requeset a tool!" });
    }

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      const tool = await Tool.findOne({ where: { id: req.body.toolId } });
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found.' });
      }

      if (tokenData.id === tool.Owner_Id) {
        return res.status(403).json({ error: 'You cannot request to borrow your own tool.' });
      }

      if (!tool.available) {
        return res.status(400).json({ message: 'Tool is not available.' });
      }

      await tool.update({ available: false });

      const newShare = await Share.create({
          date: req.body.date,
          notes: req.body.notes,
          Borrower_Id: tokenData.id,
          Tool_Id: req.body.toolId,
          Lender_Id: tool.Owner_Id
      });
      res.json(newShare);
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error.", err });
    }
});

// Confirm share request
router.put("/confirm/:id", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to confirm a request." });
    }

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);

      const share = await Share.findByPk(req.params.id);
      if (!share) {
        res.status(404).json({ error: 'Share not found.' });
        return;
      }

      if (tokenData.id !== share.Lender_Id) {
        return res.status(403).json({ error: 'This request is not for your, sorry.' });
      }

      share.confirmed = true;
      await share.save();
      res.json(share);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error.'});
    }
});

// Deny share request
router.put("/deny/:id", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to deny a request." });
    }

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      
      const share = await Share.findByPk(req.params.id);
      if (!share) {
        res.status(404).json({ error: 'Share not found.' });
        return;
      }

      if (tokenData.id !== share.Lender_Id) {
        return res.status(403).json({ error: 'This request is not for your, sorry.' });
      }

      share.confirmed = false;
      await share.save();
      res.json(share);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;