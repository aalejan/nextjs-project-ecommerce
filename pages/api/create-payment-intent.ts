import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AddCartType } from "@/types/AddCartType";

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
    res.status(403).json({ error: "Not logged in" });
  }

  //Data from req.body
  const { items, payment_intent_id } = req.body;
  const orderData = {
    user: { connect: { id: userSession?.user?.id } },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    paymnetIntentId: payment_intent_id,
    products: {
      create: items.map((item) => {
        name: item.name;
        description: item.description;
        quantity: item.quantity;
        unit_amount: item.unit_amount;
      }),
    },
  };
  res.status(200).json({ userSession });

  return;
}
