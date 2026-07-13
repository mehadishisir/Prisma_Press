import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { userController } from "./users.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { authMiddleware } from "../../middleware/authmiddleware";
// interface IJwtPayload extends JwtPayload {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
// };
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

const router = Router()
router.post("/register",userController.registerUser )


router.get("/me",
//     (req: Request, res: Response, next: NextFunction)=>{
//      const { accesstoken } = req.cookies;
//   console.log(accesstoken);

//   const result = jwtUtils.verifyToken(accesstoken, config.jwt_access_token_secret);
//   console.log(result);

//   if(typeof result.data === "string"){
//    throw new Error("Invalid token");
// }
  
//   const{id,name,email,role}=result.data as JwtPayload
//   console.log(role)

//   const requirdRoles = [Role.ADMIN,Role.USER]
// if(!requirdRoles.includes(role)){
//     return res.status(httpStatus.FORBIDDEN).json({
//         success:false,
//         message:"You are not authorized to access this resource"
//     })
// }
// req.user={
//     id,
//     name,
//     email,
    
//     role
// }
// next()
// } 
authMiddleware.auth(Role.ADMIN,Role.USER) ,userController.getUser)

router.put("/my-profile", authMiddleware.auth(Role.ADMIN,Role.USER), userController.updateUser)

 export const userRoutes = router