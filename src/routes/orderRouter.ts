import Elysia ,{t} from "elysia";
import { autoPlugin } from "../middleware/autoPlugin";
import { prisma } from "../models/db";
import Stripe from "stripe";
import { nanoid } from "nanoid";

const stripeClient = new Stripe(Bun.env.STRIPE_SECRET_KEY as string, {
 apiVersion:"2024-12-18.acacia"
})

export const orderRouter = new Elysia({prefix:"/orders"})
.use(autoPlugin)
.post("/" , async({user ,body}) => {
 try {
  const {orderItems , deliveryAddress , totalPrice } = body;
  const orderId = "order_" + nanoid();
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount:totalPrice*100,
    currency:"inr"
  })

  const order = await prisma.order.create({
    data : {
      user : {
        connect : {
          id : user.id
        },
      },
     id:orderId,
     deliveryAddress,
     deliveryStatus :"PENDING",
     totalPrice:totalPrice,
     paymentDetails:{
      amount : paymentIntent.amount,
     },
     paymentIntenId:paymentIntent.id,
     paymentStatus :"PENDING"
    }
  })
 
const __orderItems = await prisma.orderItem.createMany({
     data :  orderItems.map((orderItem) => {
        return {
          quantity : orderItem.quantity,
          price : orderItem.price,
          orderId ,
          productId: orderItem.productId
        }
     })
   })

 return {
  order,
  clientSecret: paymentIntent.client_secret
}

  
 } catch (error) {
  console.log("Error on Order The Items")
 }
},{
 body : t.Object({
  deliveryAddress : t.String(),
  totalPrice:t.Number(),
  orderItems : t.Array(
    t.Object({
      productId : t.String(),
      quantity : t.Number(),
      price: t.Number()
    })
  )
 })
}
)

.get("/",async({user}) => {
  const orders = await prisma.order.findMany({
    where :{
      userId :user.id
    }
  })
  return orders
},{
  
})