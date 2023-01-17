import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { ProductSchema } from "validators/productSchema";

const EditProductSchema = ProductSchema.omit({ images: true });

const CreateProduct = () => {
  const [product, setProduct] = useState({});
  const [checkOnSale, setCheckOnSale] = useState(false);

  const [checkLoad, setCheckLoad] = useState(true);
  const [readyToEdit, setReadyToEdit] = useState(false);
  const [noProd, setNoProd] = useState(false);

  const [images, setImages] = useState([]);

  const { categories, auth, notify } = useCtx();

  const { title, price, inStock, description, content, category, onSale } =
    product;

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

  const disabled = zo.validation?.success === false;

  useEffect(() => {
    if (auth.user && Object.keys(product).length !== 0 && !onEdit) {
      handleSubmit();
    }
  }, [product]);

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
        setCheckLoad(true);
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
    setProduct({ ...product, onSale: checkOnSale });
  }, [checkOnSale]);

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
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return notify({ error: "Please add all the fields." });

    notify({ loading: true });
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

    return notify({ success: res.msg });
  };

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;

  if (noProd) return <NoProduct />;

  if (!checkLoad) return <Loading />;

  return (
    <div className="products_manager">
      <NextSeo title={`${process.env.WEBSITE_NAME} | Create Product`} />

      <form className="row" ref={onEdit ? zoEdit.ref : zo.ref}>
        <div className="col-md-6">
          <Input
            type="text"
            name={zo.fields.title()}
            errorMessage={zo.errors.title((e) => e.message)}
            label="Title"
            defaultValue={title ? title : null}
          />

          <div className="row">
            <div className="col-sm-6">
              <Input
                type="number"
                name={zo.fields.price()}
                errorMessage={zo.errors.price((e) => e.message)}
                min={0}
                label="Price"
                defaultValue={price ? price : null}
              />
            </div>

            <div className="col-sm-6">
              <Input
                type="number"
                name={zo.fields.inStock()}
                errorMessage={zo.errors.inStock((e) => e.message)}
                min={0}
                label="inStock"
                defaultValue={inStock ? inStock : null}
              />
            </div>
          </div>

          <Input
            name={zo.fields.description()}
            errorMessage={zo.errors.description((e) => e.message)}
            cols="30"
            rows="3"
            label="Description"
            defaultValue={description ? description : null}
          />

          <TextArea
            name={zo.fields.content()}
            errorMessage={zo.errors.content((e) => e.message)}
            cols="30"
            rows="4"
            label="Content"
            defaultValue={content ? content : null}
          />

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <CheckBox
                  label="on sale"
                  onChange={handleCheck}
                  name={zo.fields.onSale()}
                  errorMessage={zo.errors.onSale((e) => e.message)}
                  isSelected={checkOnSale}
                  style={{ width: "20px", height: "20px" }}
                >
                  Product on Sale?
                </CheckBox>
              </div>
            </div>
          </div>

          <div className="input-group-prepend px-0 my-2">
            {checkLoad && (
              <select
                name={zo.fields.category()}
                defaultValue={category ? category : "all"}
              >
                <option value="all">All Products</option>
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
            {zo.errors.category((e) => (
              <ErrorMessage message={e.message} />
            ))}
          </div>

          <Button isDisabled={disabled} type="submit">
            {onEdit ? "Update" : "Create"}
          </Button>
        </div>

        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Upload</span>
            </div>
            <div className="custom-file border rounded">
              <input
                type="file"
                name={zo.fields.images()}
                onChange={handleUploadInput}
                multiple
                accept="image/*"
                // defaultValue={images ? images[0] : null}
              />
              {zo.errors.images.size((e) => (
                <ErrorMessage message={e.message} />
              ))}
            </div>
          </div>

          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div key={index} className="file_img my-1">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  className="img-thumbnail rounded"
                />

                <span onClick={() => deleteImage(index)}>X</span>
              </div>
            ))}
          </div>
        </div>
      </form>

      <GoBack />
    </div>
  );
};

export default CreateProduct;
