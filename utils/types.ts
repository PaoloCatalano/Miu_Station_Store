type Image = { public_id: string; url: string }[];

export type Product = {
  category: string;
  checked: boolean;
  content: string;
  createdAt: string;
  description: string;
  images: Image;
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

export type Cart = {
  images: Image;
  inStock: number;
  price: number;
  quantity: number;
  sold: number;
  title: string;
  _id: number;
};

export type User = {
  address: string;
  avatar: string;
  createdAt: string;
  email: string;
  isVerified: boolean;
  mobile: number;
  name: string;
  passwordToken?: string;
  passwordTokenExpirationDate?: any;
  role: string;
  root: boolean;
  updatedAt: string;
  verificationToken: string;
  verified: string;
  __v: number;
  _id: string;
};

export type Order = {
  address: string;
  cart: Cart;
  createdAt: string;
  dateOfPayment: string;
  delivered: boolean;
  method: string;
  mobile: string;
  paid: boolean;
  total: number;
  updatedAt: string;
  user: User;
  __v: number;
  _id: string;
};
