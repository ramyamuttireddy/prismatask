import Elysia from "elysia";

const userRouter = new Elysia().group("/users",(app) =>
    app.get("/",() =>{
        return [
            {
                name:"user"
            }
        ];
    }) 
    .get("/:id",(req) =>{
        return req.params.id;
    })
    .post("/" , (req) => {
        return req.body;
    })
    .put("/:id",(req) => {
        return req.body;
    })
    .delete("/:id" ,(req) =>{
      return  req.params.id;
    })
    
)

export default userRouter;