"use client";

import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { AiFillShopping } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  const dropdownHandler = () => {
    signOut();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <nav className='flex justify-between items-center py-8'>
      <Link href={"/"}>
        <h1 className='font-lobster text-xl'>TechDepot</h1>
      </Link>

      <ul className=' flex items-center gap-12'>
        <li
          onClick={() => cartStore.toggleCart()}
          className='flex items-center text-3xl relative cursor-pointer'
        >
          <AiFillShopping />
          {isMounted && cartStore.cart.length > 0 && (
            <AnimatePresence>
              <motion.span
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
                className='bg-primary text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center'
              >
                {isMounted && cartStore.cart.length}
              </motion.span>
            </AnimatePresence>
          )}
        </li>
        {/* {If user is not signed in} */}
        {!user && (
          <li className='bg-teal-600 text-white py-2 px-4 rounded-md'>
            <button onClick={() => signIn()}>Sign in</button>
          </li>
        )}
        {user && (
          <li>
            <div className='dropdown dropdown-end cursor-pointer'>
              <Image
                src={user?.image as string}
                alt={user.name as string}
                width={36}
                height={36}
                className='rounded-full'
                tabIndex={0}
              />
              <ul
                tabIndex={0}
                className='dropdown-content menu p-4 space-y-4 shadow bg-base-100 rounded-box w-72'
              >
                <Link
                  className='hover:bg-base-300 p-4 rounded-md'
                  href={"/dashboard"}
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  Orders
                </Link>
                <li
                  onClick={dropdownHandler}
                  className='hover:bg-base-300 p-4 rounded-md'
                >
                  Sign out
                </li>
              </ul>
            </div>
          </li>
        )}
      </ul>
      <AnimatePresence>
        {isMounted && cartStore.isOpen && <Cart />}
      </AnimatePresence>
    </nav>
  );
}
