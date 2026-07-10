import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const logInController = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const logInResult = await authService.logInService(payload);
    sendResponse(res,{
        success:true,
        message:"User logged in successfully",
        data:logInResult,
        statusCode:httpStatus.OK
    })

})

export const authController = {
    logInController
}