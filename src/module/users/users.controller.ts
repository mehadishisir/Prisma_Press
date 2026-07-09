import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";


// regusteruser
// const registerUser = async (req:Request,res:Response)=>{
// try {
//       const payload = req.body;
//  const user = await userService.registerUserIntoDB(payload)
//   res.status(httpStatus.CREATED).json({
//     success:true,

//     message : "User registered successfully",
//     data : user,
//   });

// } catch (error) {
//     console.log(error)
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success : false,
//         message:"something went wrong"
//     })
// }
// }

const registerUser = catchAsync(async (req:Request,res:Response)=>{
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload) 
     res.status(httpStatus.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: user,
  }); 
})
export const userController ={
    registerUser
}