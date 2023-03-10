const express = require('express');
const router = express.Router();
const { User, Tool, Type } = require('../models');


// Get all tools
router.get("/", (req, res) => {
    Tool.findAll({
      include: [User],
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
            toolname:req.body.toolname,
            description:req.body.description,
            TypeId:req.body.TypeId,
            UserId: tokenData.Id
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


// Show all tool for tool type when searching
router.get("/tools/bytype/:id", (req, res) => {
    const typeId = req.params.id;
    Tool.find({ TypeId: typeId, borrowed_by: null }, (err, foundTools) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json(foundTools);
    });
});

// Show tools currently lent
router.get("/tools/borrowed/:id", (req, res) => {
    Tool.find({ borrowed_by: User }, (err, tools) => {
       if (err) {
        return res.status(500).json({ error: err.message });
       }
       res.json(tools);
    });
});

// Return tool
router.put("/tools/return/:id", (req, res) => {
    const toolId = req.params.id;
    const returnData = req.body;
    const userId = getUserIdFromToken(req.headers.authorization);

    Tool.findById(toolId, (err, tool) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found.' });
        }
        if (tool.borrowed_by !== userId) {
            return res.status(403).json({ message: 'You are not authorized to return this tool.' });
        }

    tool.returned_on = new Date();
    Object.assign(tool, returnData);
    tool.save((err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(tool);
    });
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
          if (foundTool.UserId !== tokenData.id) {
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