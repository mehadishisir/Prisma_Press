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
  
  const profile = await userService.getUserFromDB(req.user?.id as string);

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