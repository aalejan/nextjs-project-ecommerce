import Image from "next/image";
import { Inter } from "next/font/google";
import Stripe from "stripe";
import Product from "./components/Product";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  quantity?: number;
  metadata?: string;
};

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
  });
  const products = await stripe.products.list();
  const productsWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id });
      return {
        id: product.id,
        name: product.name,
        price: prices.data[0].unit_amount,
        image: product.images[0],
        currency: prices.data[0].currency,
        metadata: product.metadata.feature,
      };
    })
  );

  return productsWithPrices;
};

export default async function Home() {
  const products = await getProducts();

  return (
    <main className=''>
      {products.map((product) => (
        <Product product={product} />
      ))}
    </main>
  );
}
