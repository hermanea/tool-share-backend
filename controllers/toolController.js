const express = require('express');
const router = express.Router();
const { User, Tool, Share, Type } = require('../models');
const jwt = require("jsonwebtoken");


// Get all tools
router.get("/", (req, res) => {
    Tool.findAll({
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

// Add a tool route
router.post("/",(req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ msg: "Please login to add a tool!" });
    }
    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        Tool.create(
            {
            name:req.body.name,
            description:req.body.description,
            Type_Id:req.body.TypeId,
            Owner_Id:tokenData.Id
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

exports.includeToolInShare = async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.toolId);

    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (!tool.available) {
      return res.status(400).json({ message: 'Tool is not available' });
    }

    await tool.update({ available: false });

    res.status(200).json({ message: 'Tool included in share.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Show all tool for tool type when searching
router.get("/tools/bytype/:id", (req, res) => {
    const typeId = req.params.id;
    Tool.findAll({
      where: { TypeId: typeId, borrowed_by: null },
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

// Show tools currently lent
router.get("/tools/borrowed/:id", (req, res) => {
    Tool.findAll({
      where: { borrowed_by: req.params.id },
      include: [
        {
          model: User,
          as: 'Owner'
        },
      ],
    })
      .then((tools) => {
        res.json(tools);
      })
      .catch((err) => {
        res.status(500).json({ msg: "Error.", err });
    });
});

// Return tool
router.put("/tools/return/:id", async (req, res) => {
    const toolId = req.params.id;
    const returnData = req.body;
    const userId = getUserIdFromToken(req.headers.authorization);

    try {
      const tool = await Tool.findByPk(req.params.toolId);

      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (!tool) {
          return res.status(404).json({ message: 'Tool not found.' });
      }
      if (tool.available) {
        return res.status(400).json({ message: 'Tool is already available' });
      }
      if (tool.borrowed_by !== userId) {
          return res.status(403).json({ message: 'You are not authorized to return this tool.' });
      }

      await tool.update({ available: true });

    tool.returned_on = new Date();
    Object.assign(tool, returnData);
    tool.save((err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(tool);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error.'})
  }
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
          if (foundTool.UserId !== tokenData.Id) {
            return res
              .status(403)
              .json({ msg: "you can only delete plays you created!" });
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