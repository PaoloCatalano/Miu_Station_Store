import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import GoBack from "components/GoBack";
import { rgbDataURL } from "utils/blurData";
// import categories_pic from "public/categories.png";
import { useCtx } from "store/globalState";
import { ACTIONS } from "store/actions";
import { postData, putData } from "utils/fetchData";
import { nameSchema } from "validators/valid";

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
    const validName = nameSchema.safeParse(e.target.value);

    if (!validName.success) {
      const validationError = fromZodError(validName.error);
      setErrorMsg(Object.values(validationError)[0][0].message);
    } else {
      setErrorMsg(null);
    }

    setName(e.target.value);
  }

  const AllCategories =
    categories
      ?.map((c) => c.name)
      .join(", ")
      .toString() || "";

  /**@TODO vercel changes */

  return (
    // <div className="col-md-6 mx-auto my-3">
    <div className="col-sm mx-auto my-3">
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

      {auth.user?.role === "admin" && (
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new category"
            value={name}
            onChange={(e) => handleSetName(e)}
          />
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            className="btn btn-secondary ml-1"
            disabled={errorMsg ? true : false}
            onClick={createCategory}
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      )}
      <div className="_image-container">
        {/* <Image
          className="rounded"
          alt="logo miu shop"
          src={categories_pic}
          layout="intrinsic"
          placeholder="blur"
          width={510}
          height={382.5}
          blurDataURL={rgbDataURL()}
          quality={100}
        /> */}
      </div>
      <div className="_division"></div>
      <ul className="categories products">
        {categories.map((category) => (
          <li key={category._id} className="my-4 text-capitalize rounded">
            <Link href={`/?category=${category._id}#products`}>
              {category.name}
            </Link>
            {auth.user?.role === "admin" && (
              <div className="d-flex justify-content-around">
                <span
                  style={{ cursor: "pointer" }}
                  className="mr-2 text-info"
                  onClick={() => handleEditCategory(category)}
                >
                  <FaEdit />
                </span>

                <span
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                  data-toggle="modal"
                  data-target="#exampleModal"
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
                  <FaTrashAlt />
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <GoBack />
    </div>
  );
};

export default Categories;
