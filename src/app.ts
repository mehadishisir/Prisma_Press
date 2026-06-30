import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

const app:Application =  express();
app.use(cors({
  origin: config.app_url,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.post("/api/users/register", async (req:Request,res:Response)=>{
  const {email,password,name,profilePhoto} = req.body;
  const isUserExist = await prisma.user.findUnique(
    {
      where : {email}
  })
  if(isUserExist){
    return res.status(httpStatus.BAD_REQUEST).json({
      message:"user with this email already exist"
    })

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
      password
    }
    ,include:{
      profile:true
    }
  })
  res.status(httpStatus.CREATED).json({

    message : "User registered successfully",
    data : user
  })
})

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
console.log("users:",user)
  return res.status(httpStatus.OK).json({
    success: true,
    data: user,
  });
});

export default app;