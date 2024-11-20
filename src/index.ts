import { Elysia } from "elysia";
import productRouter from "./routes/productRouter";

const app = new Elysia()

app.get("/",(req) =>"Hello Elysia");
app.use(productRouter()).listen(3000);




console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
