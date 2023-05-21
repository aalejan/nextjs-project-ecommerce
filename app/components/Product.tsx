import Image from "next/image";
import formatPrice from "@/utils/PriceFormat";
import { ProductType } from "@/types/ProductType";
import Link from "next/link";
export default function Product({
  name,
  unit_amount,
  image,
  id,
  description,
  metadata,
}: ProductType) {
  const { features } = metadata;
  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, unit_amount, image, id, description, features },
      }}
    >
      <div>
        <Image
          src={image}
          alt={name}
          width={800}
          height={800}
          className='w-full h-80 object-cover rounded-lg'
        />
        <div className='font-medium py-2'>
          <h1>{name}</h1>
          <h2 className='text-small text-primary'>
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </h2>
        </div>
      </div>
    </Link>
  );
}
