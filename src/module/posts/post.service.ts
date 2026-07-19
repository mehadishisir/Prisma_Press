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

const getPostById = async(postId:string)=>{
  
    const result = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
    })
    const updatedPost = await prisma.post.update({
        where:{
            id:postId
        },
        data:{
            views:{
                increment:1
            }
        },
        include:{
            comments:true
        }
    })
    return updatedPost
}
const getMyPost = async(authorId:string)=>{
    const result = await prisma.post.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt: "desc"
        },
        include:{
            comments:true,
            author:{
                omit:{
                    password:true
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }
        },
    
    })
    return result
}
export const postService ={
    createPost,
    getAllPost,
    getPostById,
    getMyPost
}