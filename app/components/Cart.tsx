"use client";
import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/utils/PriceFormat";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import basket from "@/public/online-purchase.png";
import { motion, AnimatePresence } from "framer-motion";
import Checkout from "./Checkout";
import OrderConfirmed from "./Orderconfirmed";

export default function Cart() {
  const cartStore = useCartStore();
  console.log(cartStore);

  //Total price
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className='fixed w-full h-screen left-0 top-0 bg-black/25'
    >
      {/* Cart */}
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className='bg-white absolute right-0 top-0 w-full lg:w-1/3 h-screen p-10 overflow-scroll '
      >
        {/* determine what function the button has based if user is in cart or checkout */}
        {cartStore.onCheckout === "cart" && (
          <button
            onClick={() => cartStore.toggleCart()}
            className='text-sm font-bold pb-12'
          >
            Back to store 🏃
          </button>
        )}
        {cartStore.onCheckout === "checkout" && (
          <button
            onClick={() => cartStore.setCheckout("cart")}
            className='text-sm font-bold pb-12'
          >
            Back to cart 🛒
          </button>
        )}

        {cartStore.onCheckout === "cart" && (
          <>
            {/* render cart items in cart */}
            {cartStore.cart.map((item) => (
              <motion.div layout key={item.id} className='flex py-4 gap-4'>
                <Image
                  className='rounded-md h-24 object-cover'
                  src={item.image}
                  alt={item.name}
                  height={120}
                  width={120}
                />
                <motion.div layout>
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
                </motion.div>
              </motion.div>
            ))}
          </>
        )}
        {/* {checkout and total} */}
        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" && (
          <motion.div layout>
            <p>Total: {formatPrice(totalPrice)}</p>

            <button
              onClick={() => cartStore.setCheckout("checkout")}
              className='py-2 mt-4 bg-primary w-full rounded-md text-white'
            >
              Checkout
            </button>
          </motion.div>
        )}
        {/* Checkout form */}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        {cartStore.onCheckout === "success" && <OrderConfirmed />}
        {/* empty cart display */}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === "cart" && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className='flex flex-col items-center gap-10 text-2xl font-semibold pt-32 opacity-75'
            >
              <h1>You have an empty cart...</h1>
              <Image src={basket} alt='empty cart' width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
