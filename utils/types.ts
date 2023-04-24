export type Product = {
  category: string;
  checked: boolean;
  content: string;
  createdAt: string;
  description: string;
  images: { public_id: string; url: string };
  inStock: number;
  onSale: boolean;
  price: number;
  sold: number;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

export type Category = {
  createdAt: string;
  name: string;
  updatedAt: string;
  __v: number;
  _id: string;
};
