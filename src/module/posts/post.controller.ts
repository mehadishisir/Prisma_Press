import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const id = req.user?.id
   const payload = req.body
   const result = await postService.createPost(payload,id as string) ;

   sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message : "Post Created SuccessFully",
    data:result
   })

})
const getAllPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await postService.getAllPost()

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"get all posts seccessfully",
        data:result
    })

})
const getMyposts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
const getPostById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
const getPostStatus = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
const deletePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
const updatePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
export const postController ={
    createPost,
    getAllPosts,
    getMyposts,
    getPostStatus,
    getPostById,
    deletePost,
    updatePost
}