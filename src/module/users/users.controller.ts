import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";

import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";




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
export const userController ={
    registerUser
}