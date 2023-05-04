import Image from "next/image";
import formatPrice from "@/utils/PriceFormat";
import { ProductType } from "@/types/ProductType";

export default function Product({ name, price, image }: ProductType) {
  return (
    <div>
      <Image src={image} alt={name} width={400} height={400} className='' />
      <h1>{name}</h1>
      {price !== null ? formatPrice(price) : "N/A"}
    </div>
  );
}
