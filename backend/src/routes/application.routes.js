import { Router } from "express";
import {verifyJWT} from "../middleware/verifyJwt.middleware.js"
import { addApplication } from "../controllers/application.controller.js";
const applicationRouter=Router()
applicationRouter.route("/add-Application").post(verifyJWT,addApplication);
export default applicationRouter