import { Elysia } from "elysia";
import productRouter from "./routes/productRouter";
import userRouter from "./routes/userRouter";
import swagger from "@elysiajs/swagger";
 

const app = new Elysia()

app.get("/",(req) =>"Hello Elysia");
app.use(swagger())
app.use(productRouter)
app.use(userRouter)
.listen(3000);




console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
