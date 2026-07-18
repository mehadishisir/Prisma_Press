import { NextFunction, Request } from "express";
import { ICreatePost } from "./post.interface";
import { prisma } from "../../lib/prisma";

const createPost = async(payload:ICreatePost ,userId:string)=>{
    const result = await prisma.post.create(
        {
           data:{
            ...payload,
            authorId:userId
           }
        }
    )
    return result
}
 
const getAllPost = async()=>{
    const result = await prisma.post.findMany({
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
    })
    return result
}
export const postService ={
    createPost,
    getAllPost
}