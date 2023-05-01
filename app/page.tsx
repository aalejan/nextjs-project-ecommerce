import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className=''>
      <h1 className='text-lg'>Hello Next 13</h1>
    </main>
  );
}
