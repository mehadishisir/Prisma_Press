import { NextFunction, Request } from "express";
import { ICreatePost, IupdatePost } from "./post.interface";
import { prisma } from "../../lib/prisma";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";

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
const getPostStatus= async()=>{
    const transactionResult = await prisma.$transaction(async(tx)=>{
        const totalPost = await tx.post.count()
        const totalPublishedPosts = await tx.post.count({
            where:{
                status:PostStatus.PUBLISHED
            }
        })

        const totalDrafPosts = await tx.post.count({
            where:{
                status:PostStatus.DRAFT
            }
        })
        const totalArchivedPosts = await tx.post.count({
            where:{
                status:PostStatus.ARCHIVED
            }
        })
        const totalComments=await tx.comment.count()
        const totalApprovedComments = await tx.comment.count({
            where:{
                status:CommentStatus.APPROVED
            }
        })
        const totalRejectededComments = await tx.comment.count({
            where:{
                status:CommentStatus.REJECTED
            }
        })

        const totalPostviews= await tx.post.aggregate({
            _sum:{
                views:true
            }
        })

        return{
            totalPost,
            totalPublishedPosts,
            totalDrafPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectededComments,
            totalPostviews
        }
    })
    return transactionResult
}
export const postService ={
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost,
    deletePost,
    getPostStatus
}