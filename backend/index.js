import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setServers } from "node:dns/promises";
import mainRouter from "./routes/mainRouter.js";
import {connectToServer} from "./controllers/socketManager.js";

setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/",mainRouter);

const server = createServer(app);
const io = connectToServer(server);


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected!");
}).catch((err)=>{
    console.log(err);
})


app.get("/",(req,res)=>{
    res.send("Home page");
})

server.listen(port,()=>{
    console.log(`Listining to port : ${port}`);
})