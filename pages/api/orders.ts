import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      //get user
      const user = await getServerSession(req, res, authOptions);
      if (!user) {
        res.status(403).json({ error: "Not logged in" });
      }

      //get orders for user
      const orders = await prisma.order.findMany({
        where: { id: user?.user?.id },
        include: {
          products: true,
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Methods not allowed");
  }
}
