import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";
import { ZodError } from "zod";
import { ServerProductSchema } from "validators/productSchema";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Products.findById(id);

    if (!product)
      return res
        .status(404)
        .json({ err: `The product with id ${id} does not exist.` });

    res.json({ product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const {
      title,
      price,
      inStock,
      description,
      content,
      onSale,
      category,
      images,
    } = req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return res.status(400).json({ err: "Please add all the fields." });

    ServerProductSchema.parse({
      title,
      price,
      inStock,
      description,
      content,
      onSale,
      category,
    });

    await Products.findOneAndUpdate(
      { _id: id },
      {
        title: title.toLowerCase(),
        price,
        inStock,
        description: description.toLowerCase(),
        content: content.toLowerCase(),
        onSale,
        category,
        images,
      }
    );

    res.json({ msg: "Success! Product updated" });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Products.findByIdAndDelete(id);

    res.json({ msg: "Product deleted. Refreshing page." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
