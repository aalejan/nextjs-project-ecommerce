export type ProductType = {
  id: string;
  name: string;
  price: number | null;
  image: string;
  description?: string;
  quantity?: number;
  metadata?: string;
};
