import { Router } from "express";
import { register,login, addHistory, fetchHistory ,fetchUser} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.route("/login").post(login);
userRouter.route("/register").post(register);
userRouter.route("/add_to_activity").post(authMiddleware,addHistory);
userRouter.route("/get_all_activity").get(authMiddleware,fetchHistory);
userRouter.route("/user").get(authMiddleware,fetchUser);

export default userRouter;