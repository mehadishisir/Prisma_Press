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

const auth =(...requiredRoles: Role[])=>{
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accesstoken 
        //  req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if (!token) {
          throw new Error("No token provided");

    }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_token_secret);
    if (!verifiedToken.success) {
      throw new Error("Invalid token");
    }
const { id, name, email, role } = verifiedToken.data as JwtPayload;
if (requiredRoles && !requiredRoles.includes(role)) {
    throw new Error("You are not authorized to access this resource");
}

const user = await prisma.user.findUnique({
    where: { id , email, name, role },
})

if (!user) {
    throw new Error("User not found");      
}
if (user.activeStatus === "BLOCKED") {
    throw new Error("User is blocked");
}
req.user = {
    id,name,email,role
}
next()
    
});
}
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
auth(Role.ADMIN,Role.USER)
,userController.getUser )
 export const userRoutes = router