import userModel from "../models/userModel.js";
import status from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import meetingModel from "../models/meetingModel.js";

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
        res.status(status.CREATED).json({token,result});
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
        res.status(200).json({token,user});
    }catch(err){
        res.send(err);
    }
}

const addHistory = async(req,res)=>{
    try{
        let {meetingId} = req.body;
        const newMeet = new meetingModel({
            user_id:req.user.id,
            meetingId:meetingId
        });
        await newMeet.save();
        res.json({success:true});
    }catch(err){
        res.send(err);
    }
}

const fetchHistory= async(req,res)=>{
    try{
        const data = await meetingModel.find({
            user_id:req.user.id
        })
        res.json({data});
    }
    catch(err){
        res.send(err);
    }
}

const fetchUser = async(req,res)=>{
    try{
        const user = await userModel.findById(req.user.user_id);
        res.json({user});
    }
    catch(err){
        res.send(err);
    }
}

export {register,login,addHistory,fetchHistory,fetchUser};