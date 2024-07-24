// controllers/userController.js
const { CustomError } = require('../middlewares/error');
const User = require('../models/User.model');

const getUserController = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError("User_Not_Found", 404);
        }
        const { password, ...data } = user._doc;
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

const updateUserController=async(req, res, next)=>{
    const {userId}=req.params;
    const updateData=req.body;
    try{
        const userToUpdate=await User.findById(userId);
        if(!userToUpdate){
            throw new CustomError("User_Not_Found",404);

        }
        Object.assign(userToUpdate,updateData);
        await userToUpdate.save();  
        res.status(200).json({message: "user updated successfully", user: userToUpdate});
    }catch(e){next(e);}
}

const followUserController=async(req,res,next)=>{
const {userId}=req.params;
const {id}=req.body;
    try{
        if(userId===id){
            throw new CustomError("You can't follow yourself",400);
        }
        const loggedInUserId = req.user._id; 

        const userToFollow=await User.findById(userId);
        const loggedInUser=await User.findById(loggedInUserId);

        if(!userToFollow||!loggedInUser){throw new CustomError("User Not Found!", 404);}
        loggedInUser.following.push(userId);
        userToFollow.followers.push(loggedInUserId);

        await loggedInUser.save();  
        await userToFollow.save();
        res.status(200).json({message: "user followed successfully", user: loggedInUser});  
    }
    catch(e){next(e);}
}
module.exports = { getUserController, updateUserController,followUserController };
