import connectDB from "utils/connectDB";
import Products from "models/productModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProductsOnSale(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const getProductsOnSale = async (req, res) => {
  try {
    const products = await Products.find({
      onSale: true,
      inStock: { $gte: 1 },
    }).sort({ price: 1 });

    res.status(200).json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
