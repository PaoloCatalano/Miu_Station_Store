import connectDB from "utils/connectDB";
import Categories from "models/categoriesModel";
import Products from "models/productModel";
import auth from "middleware/auth";
import { nameSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { name } = req.body;

    //parse with zod
    nameSchema.parse(name);

    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "Success! Update a new category",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (err) {
    if (err instanceof ZodError){
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    const products = await Products.findOne({ category: id });
    if (products)
      return res.status(403).json({
        err: "Please delete all related products first.",
      });

    await Categories.findByIdAndDelete(id);

    res.json({ msg: "Success! Category Deleted" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
