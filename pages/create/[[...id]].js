import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { ZodSchema } from "zod";
import { useZorm } from "react-zorm";
import { useCtx } from "store/globalState";
import { imageUpload } from "utils/imageUpload";
import { postData, getData, putData } from "utils/fetchData";
import PleaseSign from "components/PleaseSign";
import GoBack from "components/GoBack";
import Button from "components/Button";
import CheckBox from "components/CheckBox";
import Input from "components/Input";
import Loading from "components/Loading";
import NoProduct from "components/NoProduct";
import ErrorMessage from "components/ErrorMessage";
import TextArea from "components/TextArea";
import Fieldset from "components/Fieldset";
import { ProductSchema } from "validators/productSchema";
import { FaTrashAlt } from "react-icons/fa";

const EditProductSchema = ProductSchema.omit({ images: true });

const CreateProduct = () => {
  const [product, setProduct] = useState({});
  const [checkOnSale, setCheckOnSale] = useState(false);

  const [checkLoad, setCheckLoad] = useState(true);
  const [readyToEdit, setReadyToEdit] = useState(false);
  const [readyToCreate, setReadyToCreate] = useState(false);
  const [noProd, setNoProd] = useState(false);

  const [images, setImages] = useState([]);

  const { categories, auth, notify, isLoading } = useCtx();

  const { title, price, inStock, description, content, category } = product;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  if (
    ProductSchema instanceof ZodSchema === false ||
    EditProductSchema instanceof ZodSchema === false
  ) {
    throw Error("useZorm must have a ZodSchema as second argument");
  }

  const zo = useZorm("createProduct", ProductSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      setProduct({ ...e.data, images });
      setReadyToCreate(true);
      //useEffect trigger handleSubmit()
    },
  });

  const zoEdit = useZorm("editProduct", EditProductSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      setProduct({ ...e.data, images });
      setReadyToEdit(true);
      //useEffect trigger handleSubmit()
    },
  });

  const disabled =
    zo.validation?.success === false || zoEdit.validation?.success === false;

  useEffect(() => {
    if (
      auth.user &&
      Object.keys(product).length !== 0 &&
      !onEdit &&
      readyToCreate
    ) {
      handleSubmit();
      setReadyToCreate(false);
    }
  }, [readyToCreate]);

  useEffect(() => {
    if (readyToEdit) {
      handleSubmit();
      setReadyToEdit(false);
    }
  }, [readyToEdit]);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      setCheckLoad(false);
      getData(`product/${id}`).then((res) => {
        if (res.err) {
          notify({ error: res.err });
          return setNoProd(true);
        }

        setProduct(res.product);
        setCheckOnSale(res.product.onSale);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct({});
      setImages([]);
    }
  }, [id]);

  const handleCheck = () => {
    setCheckOnSale(!checkOnSale);
  };

  useEffect(() => {
    if (Object.keys(product).length !== 0) {
      setProduct({ ...product, onSale: checkOnSale });
    }
  }, [checkOnSale]);

  useEffect(() => {
    setCheckLoad(true);
  }, [product]);

  const handleUploadInput = (e) => {
    notify({});
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0) return notify({ error: "File does not exist." });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The largest image size is 1mb");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Image format is incorrect.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) notify({ error: err });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return notify({ error: "Select up to 5 images." });
    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async () => {
    if (auth.user.role !== "admin")
      notify({ error: "Authentication not valid." });

    if (
      !title ||
      price < 0 ||
      inStock < 0 ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return notify({ error: "Please add all the fields." });

    notify({ loading: true });
    isLoading(true);
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err) return notify({ error: res.err });
    } else {
      res = await postData(
        "product",
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err) return notify({ error: res.err });
    }

    if (!res.err) {
      isLoading(false);
    }

    return notify({ success: res.msg });
  };

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;

  if (noProd) return <NoProduct />;

  if (!checkLoad) return <Loading />;

  return (
    <>
      <NextSeo title={`${process.env.WEBSITE_NAME} | Create Product`} />

      <form
        className="relative w-min container flex flex-col items-center justify-center gap-5 md:flex-row md:items-start"
        ref={onEdit ? zoEdit.ref : zo.ref}
      >
        <aside className="max-h-min top-1 md:pl-4 md:sticky">
          <Fieldset legend={`${onEdit ? "Update" : "Create"} Product`}>
            <Input
              type="text"
              name={zo.fields.title()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.title((e) => e.message)
                  : zo.errors.title((e) => e.message)
              }
              label="Title"
              defaultValue={title ? title : null}
            />

            <Input
              type="number"
              name={zo.fields.price()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.price((e) => e.message)
                  : zo.errors.price((e) => e.message)
              }
              label="Price"
              defaultValue={price ? price : "0"}
            />

            <Input
              type="number"
              name={zo.fields.inStock()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.inStock((e) => e.message)
                  : zo.errors.inStock((e) => e.message)
              }
              label="inStock"
              defaultValue={inStock ? inStock : "0"}
            />

            <Input
              name={zo.fields.description()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.description((e) => e.message)
                  : zo.errors.description((e) => e.message)
              }
              cols="30"
              rows="3"
              label="Description"
              defaultValue={description ? description : null}
            />

            <TextArea
              name={zo.fields.content()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.content((e) => e.message)
                  : zo.errors.content((e) => e.message)
              }
              label="Content"
              defaultValue={content ? content : null}
            />

            <div className="text-left ml-2 -mt-4 mb-2">
              {categories && checkLoad && (
                <select
                  className="capitalize bg-slate-50 w-full mb-2 text-slate-500 cursor-pointer focus:outline-none focus:text-slate-600 transition"
                  name={zo.fields.category()}
                  defaultValue={category ? category : "all"}
                >
                  <option value="all" className="text-slate-700 font-bold">
                    Category
                  </option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
              {onEdit
                ? zoEdit.errors.category((e) => (
                    <ErrorMessage message={e.message} />
                  ))
                : zo.errors.category((e) => (
                    <ErrorMessage message={e.message} />
                  ))}
            </div>

            <CheckBox
              label="on sale"
              onChange={handleCheck}
              name={zo.fields.onSale()}
              errorMessage={
                onEdit
                  ? zoEdit.errors.onSale((e) => e.message)
                  : zo.errors.onSale((e) => e.message)
              }
              isSelected={checkOnSale}
            >
              Product on Sale?
            </CheckBox>

            <Button isDisabled={disabled} type="submit">
              {onEdit ? "Update" : "Create"}
            </Button>
          </Fieldset>
        </aside>
        <div className="max-h-min">
          <Fieldset legend="Upload Images">
            <div className="my-4">
              <input
                className="cursor-pointer w-[240px] md:w-auto"
                type="file"
                name={zo.fields.images()}
                onChange={handleUploadInput}
                multiple
                accept="image/*"
                // defaultValue={images ? images[0] : null}
              />

              {onEdit
                ? zoEdit.errors.images.size((e) => (
                    <ErrorMessage message={e.message} />
                  ))
                : zo.errors.images.size((e) => (
                    <ErrorMessage message={e.message} />
                  ))}
            </div>

            <div className="flex flex-col items-center">
              {images.map((img, index) => {
                return (
                  <div
                    key={index}
                    className="my-1 relative w-[243.2px] h-[243.2px] md:h-[50vh] md:w-[346.4px] bg-slate-100 rounded"
                  >
                    <Image
                      id="newPic"
                      src={img.url ? img.url : URL.createObjectURL(img)}
                      alt={img.name ? img.name : "product"}
                      fill
                      sizes="40vw"
                      className="object-contain rounded"
                    />

                    <div onClick={() => deleteImage(index)}>
                      <FaTrashAlt className="absolute top-3 left-3 text-3xl cursor-pointer text-red-500 p-1 border-2 border-red-200 bg-slate-50 rounded transition hover:ring-2 hover:ring-red-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Fieldset>
        </div>
      </form>

      <GoBack />
    </>
  );
};

export default CreateProduct;
