"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import dicaprio from "../../public/dicaprio2.gif";
import Link from "next/link";
import { useCartStore } from "@/store";
import { useEffect } from "react";

export default function OrderConfirmed() {
  const cartStore = useCartStore();
  useEffect(() => {
    cartStore.setPaymentIntent("");
    cartStore.clearCart();
  }, []);
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className='p-12 rounded-md text-center'>
        <h1 className='text-xl font-medium'>Your order has been placed</h1>
        <h2 className='text-sm my-4'>Check your email for receipt.</h2>
        <Image src={dicaprio} className='py-8' alt='Congrats' />
        <div className='flex items-center justify-center gap-12'>
          <Link href={"/dashboard"}>
            <button
              onClick={() => {
                setTimeout(() => {
                  cartStore.setCheckout("cart");
                }, 1000);
                cartStore.toggleCart();
              }}
              className='font-medium'
            >
              Check your Order
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
