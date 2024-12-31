import Elysia, { error } from "elysia";
import Stripe from "stripe";

export const webhook = new Elysia({})

.post("/webhook" ,async ({body , headers ,response}) => {

const stripeClient = new Stripe(Bun.env.STRIPE_SECRET_KEY as string, {
apiVersion:"2024-12-18.acacia"
})

const sig = headers["stripe-signature"];
let event;

try {
    // @ts-ignore
    event = stripeClient.webhooks.constructEvent(body ,sig,"whsec_qA0ujtxF6ke2P9wr0kaEUpnDZtcWfsWu")
} catch (err) {
   return error(400,"Bad Request") 
}

switch(event.type) {
    case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        break;
    case "payment_intent.created":
        const paymentIntentCreated = event.data.object;
        console.log(paymentIntentCreated,"payment_created")
        break;

    case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object
        console.log("payment completed" , paymentIntentSucceeded)
        break;
        default : 
        console.log(`unhandled event type ${event.type}`)
}
return {received : true}
})