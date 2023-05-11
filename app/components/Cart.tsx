"use client";
import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/utils/PriceFormat";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import basket from "@/public/online-purchase.png";

export default function Cart() {
  const cartStore = useCartStore();
  console.log(cartStore);

  //Total price
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return (
    <div
      onClick={() => cartStore.toggleCart()}
      className='fixed w-full h-screen left-0 top-0 bg-black/25'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='bg-white absolute right-0 top-0 w-1/3 h-screen p-10 overflow-scroll text-gray-700'
      >
        <h1>Shopping List 😂</h1>
        {cartStore.cart.map((item) => (
          <div className='flex py-4 gap-4'>
            <Image
              className='rounded-md h-24 object-cover'
              src={item.image}
              alt={item.name}
              height={120}
              width={120}
            />
            <div>
              <h2>{item.name}</h2>
              <div className='flex gap-2 '>
                <h2>Quantity : {item.quantity}</h2>
                <button
                  onClick={() =>
                    cartStore.removeProduct({
                      name: item.name,
                      id: item.id,
                      image: item.image,
                      unit_amount: item.unit_amount,
                      quantity: item.quantity,
                    })
                  }
                >
                  <IoRemoveCircle />
                </button>
                <button
                  onClick={() =>
                    cartStore.addProduct({
                      name: item.name,
                      id: item.id,
                      image: item.image,
                      unit_amount: item.unit_amount,
                      quantity: item.quantity,
                    })
                  }
                >
                  <IoAddCircle />
                </button>
              </div>

              <p className='text-sm'>
                {item.unit_amount && formatPrice(item.unit_amount)}
              </p>
            </div>
          </div>
        ))}
        {/* {checkout and total} */}
        <p>Total: {formatPrice(totalPrice)}</p>
        {cartStore.cart.length > 0 && (
          <button className='py-2 mt-4 bg-teal-700 w-full rounded-md text-white'>
            Checkout
          </button>
        )}
        {!cartStore.cart.length && (
          <div className='flex flex-col items-center gap-10 text-2xl font-semibold pt-32 opacity-75'>
            <h1>You have an empty cart...</h1>
            <Image src={basket} alt='empty cart' width={200} height={200} />
          </div>
        )}
      </div>
    </div>
  );
}
