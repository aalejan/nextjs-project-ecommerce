export type ProductType = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  description: string | null;
  quantity?: number | 1;
  metadata: MetadataType;
};

type MetadataType = {
  features: string;
};
