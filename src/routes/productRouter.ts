import Elysia from "elysia";

const productRouter = new Elysia().group("/products", (app) => 
    app.get("/",() => {
        return [];
    })
    .get("/:id",(req)=> {
        return req.params.id
    })
    .post("/",(req) =>{
         return req.body
    })

    .put("/:id",(req) => {
        return req.body
    })
    .delete("/:id" ,(req) => {
        return req.params.id;
    })
)

export default productRouter;
