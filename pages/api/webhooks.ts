import Stripe from "stripe";
import { prisma } from "@/utils/prisma";
import { buffer } from "micro"; //used to get raw body from request
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing stripe signature");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    // Invalid signature
    return res.status(400).send(`Webhook Error: ${err} `);
  }
  // Handle the event
  switch (event.type) {
    case "payment_intent.created":
      // Handle created payment
      const paymentIntent = event.data.object;
      console.log("payment intent created");
      break;
    case "charge.succeeded":
      // Handle successful charge
      const charge = event.data.object as Stripe.Charge;
      console.log("successful charge", charge);
      if (typeof charge.payment_intent === "string") {
        const order = await prisma.order.update({
          where: { paymentIntentID: charge.payment_intent },
          data: { status: "complete" },
        });
      }
      break;

    default:
      console.log("unhandled event type: " + event.type);
  }
  res.json({ recieved: true });
}
