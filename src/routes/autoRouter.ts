import Elysia, { error, t } from "elysia";
import { prisma } from "../models/db";
import { color } from "bun";
import jwt from "@elysiajs/jwt";

export const authRouter = new Elysia({ prefix: "/auth" })

.use(
    jwt({
        secret: Bun.env.JWT_TOKEN as string
    })
)
//   post function
.post(
    "/login",
    async ({ body ,jwt }) => {
       try {
        const {email ,password} =body;
        const user = await prisma.user.findUnique({
            where : {
                email,
            },
        })
        if(!user){
            return error(401,"invalid User")
        }
        const isPasswordCorrect = await Bun.password.verify(
            password,
            user?.password
        )

        if(!isPasswordCorrect){
          return error(401,"invalid Credentials")
        }
        
        const token = await jwt.sign({
          sub: user.id,
        })

        return {
          token,
          user:{
            name:user.name,
            email:user.email,
            image:user.image
          }
        };
        
      } catch (e) {
        return error(500, "Internal Server Error");
      }
    },
    {
      body: t.Object({
        email: t.String({
          minLength: 1,
        }),
        password: t.String({
          minLength: 1,
        }),
      }),
    }
  )

