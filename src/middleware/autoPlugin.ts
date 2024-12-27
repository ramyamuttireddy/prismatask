import Elysia, { error } from "elysia";
import jwt from "@elysiajs/jwt";
import { prisma } from "../models/db";


console.log(Bun.env.JWT_TOKEN,"token")

export const autoPlugin =  (app: Elysia) => 
    app.use(
        jwt({
            secret : Bun.env.JWT_TOKEN as string,
        })
    )
.derive(async({jwt,headers,set}) =>{
 const authorization = headers.authorization;
 if(!authorization?.startsWith("Bearer")){
    return error(401,"Unauthorized")
 }

 const token = authorization.slice(7);
 const payload = await jwt.verify(token)
 if(!payload){
    return error(401,"Unauthorized") 
 }
console.log(payload,"payload")
 const user = await prisma.user.findUnique({
    where : {
        id : payload.sub as string
    },
 })
 if(!user) {
    return error(401,"Unauthorized")
 }

 return {
    user : {
        id:user.id,
        name:user.name,
        email:user.email,
        Image:user.image
    }
 }
})