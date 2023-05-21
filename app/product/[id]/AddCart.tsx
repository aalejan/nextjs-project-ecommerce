"use client";

import { useCartStore } from "@/store";
import { AddCartType } from "@/types/AddCartType";
import { useState } from "react";

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity,
}: AddCartType) {
  const [added, setAdded] = useState(false);
  const cartStore = useCartStore();
  const handler = () => {
    setAdded(true);
    setTimeout(() => {
      cartStore.addProduct({ name, id, image, unit_amount, quantity });
      setAdded(false);
    }, 500);
  };

  return (
    <>
      <button onClick={handler} className='my-4 btn btn-primary w-full'>
        {!added ? "Add to cart" : "Adding to cart..."}
      </button>
    </>
  );
}
