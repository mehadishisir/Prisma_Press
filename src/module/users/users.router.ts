import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { userController } from "./users.controller";

const router = Router()
router.post("/register",userController.registerUser )
 export const userRoutes = router