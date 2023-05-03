import Image from "next/image";
import formatPrice from "@/utils/PriceFormat";

export default function Product({ product }: any) {
  const { name, price, image } = product;

  return (
    <div>
      <Image src={image} alt={name} width={400} height={400} />
      <h1>{name}</h1>
      {formatPrice(price)}
    </div>
  );
}
