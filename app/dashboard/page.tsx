import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const fetchOrders = async () => {
  const prisma = new PrismaClient();
  const user = getServerSession(authOptions);
  if (!user) {
    return null;
  }
  const orders = await prisma.order.findMany({
    where: { id: user?.user?.id },
    include: {
      products: true,
    },
  });
  return orders;
};

export default async function Dashboard() {
  const userOrders = await fetchOrders();
  if (userOrders === null) {
    return <div>You need to be logged in to view your orders</div>;
  }
  if (userOrders.length === 0) {
    return (
      <div>
        <h1>You currently have no orders</h1>
      </div>
    );
  }
  return (
    <div>
      <div className='font-medium'>
        {userOrders.map((order) => (
          <div key={order.id}>
            <h2>Order reference: {order.id}</h2>
            <p>Order placed on: {new Date(order.createdDate).toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
