import Elysia, { error, t } from "elysia";
import { prisma } from "../models/db";

export const userRouter = new Elysia({ prefix: "/users" })

  // get Function

  .get("/", async ({}) => {

    try {
    const users = await prisma.user.findMany({});
    return users
        
    } catch (error) {
       console.log("Error on Fetching data") 
    }
  })

  //   post function

  .post(
    "/create",
    async ({ body }) => {
      try {
        const { email, password, name, image } = body;
        const hashedPassword = await Bun.password.hash(password);
        const newUser = await prisma.user.create({
          data: {
            email,
            name,
            image,
            password: hashedPassword,
          },
        });
        const user = {
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
        };
        return user;
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
        name: t.String({
          minLength: 1,
        }),
        image: t.String({
          minLength: 1,
        }),
      }),
    }
  )

.put("/:id" , async({body ,params}) =>{
  const {id} = params;
  const {name} = body;
  const updatedUser = await prisma.user.update({
    where  :{
        id
    },
    data: {
        name,
    }
  });
  const user = {
    name:updatedUser.name
  }
  return user
},
{
 body : t.Object({
    name : t.String({
        minLength:1
    })
 }),
 params:t.Object({
    id:t.String({
        minLength:1
    })
 })
})


.delete("/:id", async({ params }) => {
    try {
      const { id } = params;
      console.log({id})
        const deletedUser = await prisma.user.delete({
            where : {
                id:id
            },
        })
        console.log(deletedUser)
        return deletedUser;
        
    } catch (e) {
       console.log("error" ,error) 
    }
},{
    params: t.Object ({
        id: t.String({
            minLength:1
        })
    })
}
)