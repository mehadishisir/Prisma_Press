import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

const auth =(...requiredRoles: Role[])=>{
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accesstoken? req.cookies.accesstoken :
         req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

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

export const authMiddleware = {
    auth
}