"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import formatPrice from "@/utils/PriceFormat";
import { useCartStore } from "@/store";
import totalPrice from "@/utils/TotalPrice";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const cartStore = useCartStore();
  const total = totalPrice(cartStore.cart);
  const formattedPrice = formatPrice(total);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
  }, [stripe]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!result.error) {
          cartStore.setCheckout("success");
        }
        setIsLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit} id='payment-form' action=''>
      <PaymentElement id='payment-element' options={{ layout: "tabs" }} />
      <h1>Total : {formattedPrice}</h1>
      <button id='submit' disabled={isLoading || !stripe || !elements}>
        <span id='button-text'>
          {isLoading ? <span>Processing...</span> : <span>Pay now</span>}
        </span>
      </button>
    </form>
  );
}