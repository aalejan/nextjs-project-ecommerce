import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AddCartType } from "@/types/AddCartType";
import { prisma } from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const calculateOrderAmount = (items: AddCartType[]) => {
  const total = items.reduce(
    (acc, item) => acc + item.unit_amount! * item.quantity!,
    0
  );
  return total;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Getting user
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    return res.status(403).json({ error: "Not logged in" });
  }

  //Data from req.body
  //payment_intent always starts as empty string until user checks out
  const { items, payment_intent_id } = req.body;

  const userId = userSession?.user?.id;
  const userConnect = userId ? { connect: { id: userId } } : undefined;

  //order data that will be sent to Server
  const orderData = {
    //connect the order to user in current session
    user: { connect: { id: userSession?.user?.id } },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    paymentIntentID: payment_intent_id,
    //create product records that are related to order
    products: {
      //create method to create new Product and establish relation to Order
      create: items.map((item) => ({
        name: item.name,
        description: item.description || null,
        quantity: item.quantity,
        image: item.image,
        unit_amount: parseFloat(item.unit_amount),
      })),
    },
  };

  //Check if payment intent exists just update order
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: calculateOrderAmount(items) }
      );

      //Fetch order with product ids
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentID: updated_intent.id },
        include: { products: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid payment intent" });
      }

      //update existing order
      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: parseFloat(item.unit_amount),
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
      return;
    }
  } else {
    //create new order with prisma
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    orderData.paymentIntentID = paymentIntent.id;

    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(200).json({ paymentIntent });
  }

  return;
}
