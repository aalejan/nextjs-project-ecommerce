import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formatPrice from "@/utils/PriceFormat";
import Image from "next/image";

export const revalidate = 0;
const prisma = new PrismaClient();
const fetchOrders = async () => {
  const user = await getServerSession(authOptions);

  if (!user) {
    return null;
  }
  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id, status: "complete" },
    include: {
      products: true,
    },
  });
  return orders;
};

export default async function Dashboard() {
  const userOrders = await fetchOrders();
  console.log(userOrders);
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
          <div
            key={order.id}
            className='rounded-lg p-8 my-4 space-y-2 bg-base-300'
          >
            <h2 className='text-sm font-medium'>Order reference: {order.id}</h2>
            <p className='text-sm'>
              Order placed on: {new Date(order.createdDate).toString()}
            </p>
            <p className='text-md py-2'>
              Status:{" "}
              <span
                className={`${
                  order.status === "complete" ? "bg-teal-500" : "bg-orange-500"
                } text-white py-1 rounded-md px-2 mx-2 text-sm`}
              >
                {order.status}
              </span>
            </p>
            <p className='font-medium'>Total: {formatPrice(order.amount)}</p>
            <div className='text-sm lg:flex items-center gap-4'>
              {order.products.map((product) => (
                <div className='py-2 ' key={product.id}>
                  <h2 className='py-2'>{product.name}</h2>
                  <div className='flex items-center gap-4'>
                    <Image
                      src={product.image!}
                      width={36}
                      height={36}
                      alt={product.name}
                    />
                    <p>{formatPrice(product.unit_amount)}</p>
                    <p>Quantitity: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
