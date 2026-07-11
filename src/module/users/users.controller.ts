import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";




// regusteruser


const registerUser = catchAsync(async (req:Request,res:Response)=>{
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload) 

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: user,
  })
})

const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { accesstoken } = req.cookies;
  console.log(accesstoken);

  const result = jwtUtils.verifyToken(accesstoken, config.jwt_access_token_secret);
  console.log(result);

  if (!result || result.success === false) {
    throw new Error(result?.error || "Token verification failed");
  }

  const payload = result.data as { id: string };
  const profile = await userService.getUserFromDB(payload.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: profile,
  });
});
    

export const userController ={
    registerUser,
    getUser
}