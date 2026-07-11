import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config";
import { payload } from "./users.interface";

const registerUserIntoDB = async (payload :payload)=>{
    const { name, email, password, profilePhoto } = payload;
     const isUserExist = await prisma.user.findUnique(
    {
      where : {email}
  })
  if(isUserExist){
   throw new Error("User already exists");

  }

  const hashPassword = await bcrypt.hash(password,Number(config.bycrypt_salt_rounds))

  // console.log(hashPassword)

  const createUser = await prisma.user.create({
    data :{
      name,
      email,
      password : hashPassword,


    }
  })
   await prisma.profile.create({
    data : {
      userId : createUser.id,
      profilePhoto

    }
  })
  const user = await prisma.user.findUnique({
    where : {
      id : createUser.id,
      email:createUser.email
    },
    omit:{
      password : true
    }
    ,include:{
      profile:true
    }
  })
  return user
}

const getUserFromDB = async (id: string)=>{
  const profile = await prisma.user.findUnique({
    where : {
      id: id
    },
    omit:{
      password : true
    },
    include : {
      profile : true  

    }
  })

  return profile;
}
export const userService ={
    registerUserIntoDB,
    getUserFromDB
}