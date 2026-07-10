import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogInPayload } from "./auth.interface";

const logInService = async (payload : ILogInPayload)=>{

    const {email,password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword){
        throw new Error("Invalid password")
    }
    return user;


}
export const authService = {
    logInService
}