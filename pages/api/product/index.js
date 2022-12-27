import connectDB from "utils/connectDB";
import Products from "models/productModel";
import auth from "middleware/auth";
import { ZodError } from "zod";
import productSchema from "validators/productSchema";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
    case "POST":
      await createProduct(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

class APIfeatures {
  constructor(queryDB, queryString) {
    this.queryDB = queryDB;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category !== "all")
      this.queryDB.find({ category: queryObj.category });
    if (queryObj.title !== "all")
      this.queryDB.find({
        $or: [
          { title: { $regex: queryObj.title } },
          {
            content: { $regex: queryObj.title },
          },
          {
            description: { $regex: queryObj.title },
          },
        ],
      });

    this.queryDB.find();
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.queryDB = this.queryDB.sort(sortBy);
    } else {
      this.queryDB = this.queryDB.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.queryDB = this.queryDB.skip(skip).limit(limit);
    return this;
  }
}

const getProducts = async (req, res) => {
  try {
    const features = new APIfeatures(Products.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.queryDB;

    res.json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid." });

    const {
      title,
      price,
      inStock,
      description,
      content,
      category,
      onSale,
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

    const newProduct = new Products({
      title: title.toLowerCase(),
      price,
      inStock,
      description: description.toLowerCase(),
      content: content.toLowerCase(),
      onSale,
      category,
      images,
    });

    //parsing with zod
    productSchema.parse(newProduct);

    await newProduct.save();

    res.json({ msg: "Great! You created a new product" });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
