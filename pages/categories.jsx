import { useState, useCallback, useEffect } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { fromZodError } from "zod-validation-error";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useCtx } from "store/globalState";
import { ACTIONS } from "store/actions";
import { postData, putData } from "utils/fetchData";
import { nameSchema } from "validators/valid";
import Button from "components/Button";
import Input from "components/Input";
import TitleImage from "components/TitleImage";
import pic from "public/images/logos/categories.png";
import ErrorMessage from "components/ErrorMessage";
import MoreItems from "components/MoreItems";
import SkeletonMoreItems from "components/SkeletonMoreItems";

const Categories = () => {
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [id, setId] = useState("");

  const router = useRouter();

  const { categories, auth, notify, updateItem, addCategory, addModal } =
    useCtx();

  useEffect(() => {
    if (!name) {
      setId("");
    }
  }, [name]);

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
      if (res.err) {
        setErrorMsg(res.err);
        return notify({ error: res.err });
      }

      addCategory([...categories, res.newCategory]);
    }
    setName("");
    setId("");
    return notify({ success: res.msg });
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
    setOldName(category.name);
    handleSetName(category.name);
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

  const AllCategories = useCallback(
    categories
      ?.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      })
      .map((c) => c.name)
      .join(", ")
      .toString() || ""
  );

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Categories`}
        description={`Miu Station Store is an e-commerce website where you will find categories like: ${AllCategories} and many more!`}
        canonical="https://miustationstore.netlify.app/categories"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | Categories`,
          description: `All the categories of our products`,
          url: "https://miustationstore.netlify.app/categories",
        }}
      />
      <TitleImage image={pic} alt="categories" id="top" />
      {auth.user?.role === "admin" && (
        <div className="mt-10 md:my-10">
          <Input
            type="text"
            label={id ? `Edit ${oldName}` : "Add a new category"}
            value={name}
            onChange={(e) => handleSetName(e)}
          />

          {errorMsg && <ErrorMessage message={errorMsg} />}

          <Button
            className="mt-1"
            isDisabled={errorMsg ? true : false}
            onPress={createCategory}
          >
            {id ? "Update" : "Create"}
          </Button>
        </div>
      )}
      <section>
        <ul className="max-w-screen-xl my-10 flex flex-col md:flex-row flex-wrap justify-center">
          {categories.length > 0
            ? categories.map((category) => (
                <li key={category._id} className="m-4 place-self-center">
                  <MoreItems link={`/products?category=${category._id}`}>
                    {category.name}
                  </MoreItems>
                  {auth.user?.role === "admin" && (
                    <div className="flex justify-between mx-auto mb-10 mt-2 w-60">
                      <a
                        href="#top"
                        className="cursor-pointer text-miu-600 p-1 border-2 border-miu-200 bg-slate-50 rounded transition hover:ring-2 hover:ring-miu-200"
                        onClick={() => handleEditCategory(category)}
                      >
                        <FaEdit className="text-2xl" />
                      </a>

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
              ))
            : placeholder.map((items) => (
                <li key={items.id} className="m-4 place-self-center">
                  <SkeletonMoreItems />
                </li>
              ))}
        </ul>
      </section>
    </>
  );
};

export default Categories;

const placeholder = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
];
