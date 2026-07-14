import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogInPayload } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";


const logInService = async (payload : ILogInPayload)=>{

    const {email,password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword){
        throw new Error("Invalid password")
    }
     
    const jwtPayload = {
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    }

    const accessToken = jwt.sign(jwtPayload,config.jwt_access_token_secret,
        {
        expiresIn:config.jwt_access_token_expiration_time
    } as SignOptions
);

    const refreshToken = jwt.sign(jwtPayload,config.jwt_refresh_token_secret,{
        expiresIn:config.jwt_refresh_token_expiration_time
    } as SignOptions

);

    return {
        accessToken,
        refreshToken
    };
}

const refreshToken= async (refreshToken:string)=>{
    const verifiedToken = jwt.verify(refreshToken,config.jwt_refresh_token_secret) as jwt.JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: verifiedToken.id }
    })
    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked")
    }

    const jwtPayload = {
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    }
    const accessToken = jwt.sign(jwtPayload,config.jwt_access_token_secret,{
        expiresIn:config.jwt_access_token_expiration_time
    } as SignOptions
);

    return {
        accessToken
    };

}

export const authService = {
    logInService,
    refreshToken
};