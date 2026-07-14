import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const logInController = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const {accessToken, refreshToken} = await authService.logInService(payload);

    res.cookie(
        "accesstoken",accessToken,{
            httpOnly: true,
            secure:false,
            sameSite:"none",
            maxAge: 1000 * 60 * 60 * 24 // 1 day

        }    )

    res.cookie(
        "refreshtoken",refreshToken,{
            httpOnly: true,
            secure:false,
            sameSite:"none",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        }    )

    sendResponse(res,{
        success:true,
        message:"User logged in successfully",
        data:{
            accessToken,refreshToken
        },
        statusCode:httpStatus.OK
    })

})

const refreshTokenController = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

    const refreshToken = req.cookies.refreshtoken;

    const {accessToken} = await authService.refreshToken(refreshToken);

    res.cookie(
        "accesstoken",accessToken,{
            httpOnly: true,
            secure:false,
            sameSite:"none",
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    )

    sendResponse(res,{
        success:true,
        message:"Access token refreshed successfully",
        data:{
            accessToken
        },
        statusCode:httpStatus.OK
    })
})

export const authController = {
    logInController,
    refreshTokenController
}