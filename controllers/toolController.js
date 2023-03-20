const express = require('express');
const router = express.Router();
const { User, Tool, Share, Type } = require('../models');
const jwt = require("jsonwebtoken");

// Get all tools with User
router.get("/", (req, res) => {
    Tool.findAll({
      include: [
        {
          model: User,
        as: 'Owner'
      }
    ],
    })
      .then((allTools) => {
        res.json(allTools);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Error.", err });
      });
});

// Get all available tools.
router.get("/availableTools", (req, res) => {
  Tool.findAll({
    where: {
      available: true
    },
    include: [
      {
        model: User,
        as: 'Owner'
      },
    ],
  })
    .then((allTools) => {
      res.json(allTools);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Error.", err });
    });
});

router.get("/ownerTools", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to view your shares." });
    }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Tool.findAll({
      where: {
        Owner_Id: tokenData.id
      },
      include: [
        {
          model: User,
          as: 'Owner'
        },
      ],
    })
      .then((ownerTools) => {
        res.json(ownerTools);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Error.", err });
      });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid Token." });
  }
});


// Get tool by id
router.get("/:id", (req, res) => {
  Tool.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'Owner'
      },
      ],
  })
    .then((tool) => {
      res.json(tool);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "Error.", err });
    });
});

// Add a tool route
router.post("/",(req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to add a tool." });
    }
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        Tool.create(
            {
            toolname: req.body.toolname,
            description: req.body.description,
            Type_Id: req.body.typeId,
            Owner_Id: tokenData.id,
        }
        ).then(newTool=>{
            res.json(newTool);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({msg:"Error adding tool!",err})
        });
    } catch (err) {
    return res.status(403).json({ msg: "Invalid Token." })
    }
});

// Mark tool as borrowed.
router.put('/borrow/:id', async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.id);
    if (!tool) {
      res.status(404).json({ error: 'Share not found.' });
      return;
    }

    tool.available = false;
    
    await tool.save();
    res.json(tool);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Return tool
router.put("/return/:id", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "Please login to return a tool." });
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  const userId = tokenData.id;
  
  try {
    const tool = await Tool.findByPk(req.params.id);
    
    if (!tool) {
          return res.status(404).json({ message: 'Tool not found.' });
      }
      if (tool.available) {
        return res.status(400).json({ message: 'Tool is already available' });
      }

      const share = await Share.findOne({ where: { Borrower_Id: userId, Tool_Id: tool.id } });

      if (!share) {
        return res.status(403).json({ message: 'You are not authorized to return this tool.' });
      }
      
      tool.available = true;
      
      await tool.save();
      res.json(tool);
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error.'})
  }
});

// Show all tool for tool type when searching
router.get("/bytype/:id", (req, res) => {
    const typeId = req.params.id;
    Tool.findAll({
      where: { Type_Id: typeId, Available: true },
      include: [
        {
          model: User,
          as: 'Owner'
        },
      ],
  })
  .then((foundTools) => {
    res.json(foundTools);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ msg: "Error.", err });
    });
});

// Delete a tool Protected.
router.delete("/:toolId", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ msg: "Please login to remove a tool." });
    }
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
      Tool.findByPk(req.params.toolId)
        .then((foundTool) => {
          if (!foundTool) {
            return res.status(404).json({ msg: "No such tool." });
          }
          if (foundTool.Owner_Id !== tokenData.id) {
            return res
              .status(403)
              .json({ msg: "You may only delete tools that you own." });
          }
          Tool.destroy({
            where: {
              id: req.params.toolId,
            },
          })
            .then((delTool) => {
              res.json(delTool);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                msg: "Error.",
                err,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            msg: "Error.",
            err,
          });
        });
    } catch (err) {
      return res.status(403).json({ msg: "Invalid token." });
    }
});

module.exports = router;