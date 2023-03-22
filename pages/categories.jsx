import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useCtx } from "store/globalState";
import { ACTIONS } from "store/actions";
import { postData, putData } from "utils/fetchData";
import { nameSchema } from "validators/valid";
import BgStatic from "components/BgStatic";
import Button from "components/Button";
import Input from "components/Input";
import TitleImage from "components/TitleImage";
import pic from "public/images/logos/categories.png";
import ErrorMessage from "components/ErrorMessage";

const Categories = () => {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [id, setId] = useState("");

  const router = useRouter();

  const { categories, auth, notify, updateItem, addCategory, addModal } =
    useCtx();

  const createCategory = async () => {
    if (auth.user) {
      if (auth.user.role !== "admin")
        return notify({ error: "Authentication failed." });
    }

    notify({ loading: true });

    let res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err) return notify({ error: res.err });
      updateItem(categories, id, res.category, ACTIONS.ADD_CATEGORIES);
      router.reload();
    } else {
      res = await postData("categories", { name }, auth.token);
      if (res.err) return notify({ error: res.err });

      addCategory([...categories, res.newCategory]);
    }
    setName("");
    setId("");
    return notify({ success: res.msg });
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };

  function handleSetName(e) {
    const validName = nameSchema.safeParse(e);
    if (!validName.success) {
      const validationError = fromZodError(validName.error);
      setErrorMsg(Object.values(validationError)[0][0].message);
    } else {
      setErrorMsg(null);
    }
    setName(e);
  }

  const AllCategories =
    categories
      ?.map((c) => c.name)
      .join(", ")
      .toString() || "";

  /**@TODO vercel changes */

  return (
    // <div className="col-md-6 mx-auto my-3">
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Categories`}
        description={`In this e-commerce website you will find categories like: ${AllCategories} and many more!`}
        canonical="https://miu-shop.vercel.app/categories"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | Categories`,
          description: `All the categories of our products`,
          url: "https://miu-shop.vercel.app/categories",
        }}
      />
      <BgStatic />
      <TitleImage image={pic} alt="categories" />
      {auth.user?.role === "admin" && (
        <div className="mt-10">
          <Input
            type="text"
            label="Add a new category"
            value={name}
            onChange={(e) => handleSetName(e)}
          />
          {errorMsg && <ErrorMessage message={errorMsg} />}
          <Button
            className="mt-1"
            isDisabled={errorMsg ? true : false}
            onClick={createCategory}
          >
            {id ? "Update" : "Create"}
          </Button>
        </div>
      )}

      <ul className="my-10">
        {categories.map((category) => (
          <li key={category._id} className="my-4">
            <Link href={`/products?category=${category._id}#products`}>
              <Button hipster className="capitalize">
                {category.name}
              </Button>
            </Link>
            {auth.user?.role === "admin" && (
              <div className="flex justify-between mx-auto mb-10 mt-2 w-20">
                <div
                  className="cursor-pointer text-miu-600 p-1 border-2 border-miu-200 bg-slate-50 rounded transition hover:ring-2 hover:ring-miu-200"
                  onClick={() => handleEditCategory(category)}
                >
                  <FaEdit className="text-2xl" />
                </div>

                <div
                  className="cursor-pointer text-red-500 p-1 border-2 border-red-200 bg-slate-50 rounded transition hover:ring-2 hover:ring-red-200"
                  onClick={() =>
                    addModal([
                      {
                        data: categories,
                        id: category._id,
                        title: category.name,
                        type: ACTIONS.ADD_CATEGORY, //deleteCategories()
                      },
                    ])
                  }
                >
                  <FaTrashAlt className="text-2xl" />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Categories;
