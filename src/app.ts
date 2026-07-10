import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./module/users/users.router";
import { authRouter } from "./module/auth/auth.router";

const app:Application =  express();
app.use(cors({
  origin: config.app_url,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/users",userRoutes)
app.use("/api/auth",authRouter)

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
console.log("users:",user)
  return res.status(httpStatus.OK).json({
    success: true,
    data: user,
  });
});

export default app;