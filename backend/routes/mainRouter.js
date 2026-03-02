import { Router } from "express";
import userRouter from "./userRoutes.js";
const mainRouter = Router();

mainRouter.use(userRouter);
mainRouter.get("/",(req,res)=>{
        res.send("welcome!");
    })

export default mainRouter;