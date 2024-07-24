const express = require('express');
const router = express.Router();    
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/error');
const RegController=async (req, res, next) => {
    try {
        // const newUser = new User(
        // req.body
        // );
        const {password,username,email}=req.body;
        const existingUser=await User.findOne({$or: [{username},{email}]});
        if(existingUser){
            //res.status(400).json("Username or Email already exists!")
            throw new CustomError("Username or Email already exists!",400);
        }
        const salt=await bcrypt.genSalt();
        const hashedPassword=await bcrypt.hashSync(password,salt);
        const newUser=new User({...req.body, password:hashedPassword})
        
        //console.log(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); 
    } catch (err) {
        console.error(err); 
        // res.status(500).json({ error: 'Internal Server Error' });
        next(err);
    }
}
const LoginController=async (req,res,next)=>{
    try {
        let user;
        if(req.body.email){
            user=await User.findOne({email: req.body.email});
        }
        else{
            user=await User.findOne({username:req.body.username})
        }
        if(!user){
            // return res.status(400).json("User_Not_Found!")
            throw new CustomError("User_Not_Found!",400);
        }
        const match=await bcrypt.compare(req.body.password,user.password);
        if(!match){
            // return res.status(400).json("Wrong_Credentials!")
            throw new CustomError("Wrong_Credentials!",400);
        }
        // const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:1000})
        // res.status(200).json("Logged_In_Successfully");
        // res.cookie("token",token).status(200).json(data) 
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 1000 });
        res.cookie("token", token, { sameSite: "none", secure: true }).status(200).json("Logged_In_Successfully");      
    } 
    catch (error) {
        //res.status(500).json("Internal_Server_Error"+error);
        next(error);
    }
}

const LogOutController=async (req,res)=>{   
    try{
        res.clearCookie("token", {sameSite:"none", secure:true}).status(200).json("User Logged_Out_Successfully");
    }catch(err){
        // res.status(500).json(err)
        next(err);
    }
    
    }

const RefetchController= async(req, res)=>{
    const token =req.cookies.token;
   if (!token) {
    //    return res.status(401).json("Access Denied. No token provided.");
    throw new CustomError("Access Denied. No token provided.",401);
   }
jwt.verify(token, process.env.JWT_SECRET, {}, async (err,data)=>{
   console.log(data);
   if(err){
    //    res.status(404).json(err)
    throw new CustomError(err,404);
   }
   try{
           const id =data._id;//users id
           const user= await User.findOne({_id:id}); //fetch user from databse by id
           res.status(200).json(user)
   }catch(err){
    //    res.status(500).json(err)
    next(err);
   }
});
}
module.exports={RegController,LoginController,LogOutController,RefetchController}