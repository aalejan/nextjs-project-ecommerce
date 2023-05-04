type Params = {
  id: number;
};

type SearchParams = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  description: string | null;
  quantity?: number;
  features?: string;
};

export type SearchParamTypes = {
  params: Params;
  searchParams: SearchParams;
};
