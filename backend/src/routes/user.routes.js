import {Router} from "express"
import { registerUser,loginUser } from "../controllers/user.controller.js"
const userRouter=Router()
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
export default userRouter