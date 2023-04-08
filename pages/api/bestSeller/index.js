import connectDB from "utils/connectDB";
import Products from "models/productModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getBestSeller(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const getBestSeller = async (req, res) => {
  try {
    const products = await Products.find({ inStock: { $gte: 1 } })
      .sort({ sold: -1 })
      .limit(3);

    //ISR on-demand
    res.revalidate("/");

    res.status(200).json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
