import { NextFunction, Request } from "express";
import { ICreatePost, IupdatePost } from "./post.interface";
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
  
//     const result = await prisma.post.findUniqueOrThrow({

//         where:{
//             id:postId
//         }
//     });
    
    
    // const updatedPost = await prisma.post.update({
    //     where:{
    //         id:postId
    //     },
    //     data:{
    //         views:{
    //             increment:1
    //         }
    //     },
    //     include:{
    //         comments:true
    //     }
    // })
    // return updatedPost
 
    const transiction = await prisma.$transaction(async(tx)=>{
        await tx.post.findUniqueOrThrow({

        where:{
            id:postId
        }

    
    })

    const updatePost = await prisma.post.update({
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
    return updatePost



})
return transiction

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
const updatePost = async(postId:string,payload:IupdatePost, authorId:string )=>{
  const post = await prisma.post.findUniqueOrThrow({
    where:{
        id:postId
    }
   
})
if(post.authorId !== authorId){
    throw new Error("you can not update this post")
}
 const result = await prisma.post.update({
    where:{
        id:postId
    },
    data: payload,
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
const deletePost = async(postId:string, authorId:string,isAdmin:boolean)=>{
     const post = await prisma.post.findUniqueOrThrow({
    where:{
        id:postId
    }
   
})
if(post.authorId !== authorId && !isAdmin ){
    throw new Error("you can not delete this post")
}
const result = await prisma.post.delete({
    where:{
        id:postId
    }
})
return result
}
export const postService ={
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost,
    deletePost
}