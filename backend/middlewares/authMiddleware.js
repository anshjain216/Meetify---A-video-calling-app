import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{
    const header = req.headers.authorization;
    if(!header){
        return res.status(401).json({message:"no token provided"});
    }
    try{
        const token = header.split(" ")[1];
        const decoded = jwt.verify(jwt,process.env.JWT_KEY);
        req.user = decoded;
        next();
    }catch(err){
         return res.status(401).json({ message: "Invalid token" });
    }
}