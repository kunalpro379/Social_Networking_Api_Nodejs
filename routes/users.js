// routes/users.js
const express = require('express');
const router = express.Router();
const { getUserController,updateUserController ,followUserController} = require('../controllers/userController');
///GET USER
router.get("/:userId",getUserController)

//UPDATE USER
router.put("/:userId", updateUserController);
module.exports = router;

//Follow users

router.post("/follow/:userId", followUserController);
