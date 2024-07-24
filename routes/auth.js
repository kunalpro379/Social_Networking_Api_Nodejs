const express = require('express');
const router = express.Router();    
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {RegController,LoginController,LogOutController,RefetchController}=require('../controllers/AuthControllers.js');
//REGESTER
router.post("/register", RegController);

//LOGIN
router.post(
    "/login",LoginController
);

//LOGOUT
router.get('/logout',LogOutController);
//FETCH CURRENT USER
router.get("/refetch",RefetchController)

module.exports = router;