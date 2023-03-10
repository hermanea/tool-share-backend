const express = require('express');
const router = express.Router();

const userRoutes = require("./userController")
router.use("/api/user",userRoutes)

const toolRoutes = require("./toolController")
router.use("/api/tool",toolRoutes)

const shareRoutes = require("./shareController")
router.use("/api/shares", shareRoutes)

module.exports = router;