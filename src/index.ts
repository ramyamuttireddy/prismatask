import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { userRouter } from "./routes/userRouter";
import { logger } from "@bogeychan/elysia-logger";
import { productRouter } from "./routes/productsRouter";
import  {autoPlugin } from "./middleware/autoPlugin";
import { authRouter } from "./routes/autoRouter";
import { orderRouter } from "./routes/orderRouter";
import { webhook } from "./routes/webhook";



const app =new Elysia()

app.use(cors())

  app.use(logger())
  .use(
    swagger({
      path:"/swagger"
    })
  )
  .get("/", () => {
    return "main route";
  })
  .use(userRouter)
  .use(webhook)
  .use(productRouter)
  .use(authRouter)
  .use(orderRouter)
  // .use(autoPlugin)
  .listen(3000);

console.log(`Elygia Is Running At ${app.server?.hostname}:${app.server?.port}`)