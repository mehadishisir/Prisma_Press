import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getAllComments = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getCommentById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getAuthorCommentById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const updateModerateComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const deleteComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const updateCommentById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

export const commentsController ={
    createComment,
    getAllComments,
    getAuthorCommentById,
    getCommentById,
    updateCommentById,
    updateModerateComment,
    deleteComment
}