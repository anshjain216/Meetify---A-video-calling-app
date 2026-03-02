import userModel from "../models/userModel.js";
import status from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async(req , res)=>{
    try{
        let {name,username,password} = req.body;
        let user = await userModel.findOne({username});
        if(user){
            return res.status(409).json({message:"User already exists, Please Login!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        

        const newUser = new userModel({
            name:name,
            username:username,
            password:hashedPassword,
        })

        const result = await newUser.save();
        const token = jwt.sign({user_id:result._id},process.env.JWT_KEY,{expiresIn:60*60*24*3});
        res.status(status.CREATED).json({token});
    }catch(err){
        res.send(err);
    }
}

const login = async(req , res)=>{
    try{
        let {username,password} = req.body;
        let user = await userModel.findOne({username});
        if(!user){
            return res.status(status.NOT_FOUND).json({message:"User is not signed in!"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid Credentials!!"});
        }
        const token = jwt.sign({user_id:user._id},process.env.JWT_KEY,{expiresIn:60*60*24*3});
        res.status(200).json({token});
    }catch(err){
        res.send(err);
    }
}

export {register,login};