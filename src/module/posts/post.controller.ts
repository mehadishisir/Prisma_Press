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
 const id = req.user?.id
 const result = await postService.getMyPost(id as string)

 sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"get all posts seccessfully",
        data:result
    })



})
const getPostById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
 const{postId} = req.params
 if(!postId){
     throw new Error("Post Id Required In Params")
 }
 const result = await postService.getPostById(postId as string)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"get all posts seccessfully",
        data:result
    })
})
const getPostStatus = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

})
const deletePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const authorId= req.user?.id
   const isAdmin = req.user?.role ==="ADMIN"
    const postId = req.params.postId

    if(!postId){
        throw new Error("post id is needed");
        
    }
    const result = await postService.deletePost(postId as string,authorId as string,isAdmin)

 sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post deleteted seccessfully",
        data:null
    })

})
const updatePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId= req.user?.id
    const payload=req.body
    const postId = req.params.postId

    if(!postId){
        throw new Error("post id is needed");
        
    }
    const result = await postService.updatePost(postId as string,payload,authorId as string)

 sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post updated seccessfully",
        data:result
    })

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