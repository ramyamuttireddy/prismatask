import Elysia, { error } from "elysia";
import Stripe from "stripe";
import { prisma } from "../models/db";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion:"2024-12-18.acacia"
    });

    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

    export const webhookRouter = new Elysia({prefix:"/webhook"})

    .onParse(async({request,headers}) => {
        if(headers["content-type"] === "application/json;charset=utf-8") {
            const arrayBuffer = await Bun.readableStreamToArrayBuffer(request.body!);
            const rawBody = Buffer.from(arrayBuffer)
            return rawBody
        }
    })
    .post("/",async({request,body}) => {
        const signature = request.headers.get("stripe-signature");

        if(!signature){
            throw new Error("No signature provided");
        }
        let event:Stripe.Event;
        console.log({signature})

        try {

            event = await stripe.webhooks.constructEventAsync(
                body as unknown as string,
                signature,
                "whsec_qA0ujtxF6ke2P9wr0kaEUpnDZtcWfsWu"
            )
            
        } catch (error) {
          console.log("Webhook signature verification failed:",error) 
          throw new Error(`Webhook Error: `) ;
        }

     try {
        switch(event.type){
            case "payment_intent.succeeded" : {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                 // Find booking by payment intent ID
                 const booking = await prisma.order.findFirst({
                    where : {
                        paymentIntenId:paymentIntent.id
                    }
                 })
                 if(!booking) {
                    throw new Error(`No booking found for payment intent ${paymentIntent.id}`)
                 }

                 // Update booking status

                 await prisma.order.update({
                    where:{
                        id:booking.id,
                    },
                    data: {
                        paymentStatus:"PAID",
                    }
                });
                console.log( `Payment succeeded for booking ${booking.id}`)
                break
            }
            case "payment_intent.payment_failed" : {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                const booking = await prisma.order.findFirst({
                    where: {
                        paymentIntenId:paymentIntent.id
                    }
                })
                if (!booking) {
                    throw new Error(
                      `No booking found for payment intent ${paymentIntent.id}`
                    );
                  }

                  // Update booking status 
                  await prisma.order.update({
                    where : {
                        id:booking.id
                    },
                    data: {
                        paymentStatus:"FAILED"
                    }
                  })

                  console.log(`Payment failed for booking ${booking.id}`);
                  break;
            }

            case "payment_intent.requires_action" : {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                const booking = await prisma.order.findFirst({
                    where : {
                        paymentIntenId:paymentIntent.id
                    }
                })
                if(booking) {
                    await prisma.order.update({
                        where : {
                            id:booking.id,
                        },
                        data:{
                         paymentStatus: "PENDING"  
                        }
                    })
                }
                break
            }

            case "payment_intent.canceled" : {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                const booking = await prisma.order.findFirst({
                    where : {
                        paymentIntenId :paymentIntent.id
                    }
                })

                if(booking) {
                    await prisma.order.update({
                      where:{
                        id:booking.id
                      },
                      data:{
                        paymentStatus:"FAILED"
                      }  
                    })
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return {received: true}
     } catch (err) {
        console.error("Error processing webhook:", err);
        // @ts-ignore
        throw new Error(`Webhook handler failed: ${err.message}`);
     }
       
    })