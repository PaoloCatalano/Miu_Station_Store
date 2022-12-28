import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { imageUpload } from "utils/imageUpload";
import { postData, getData, putData } from "utils/fetchData";
import PleaseSign from "components/PleaseSign";
import GoBack from "components/GoBack";

const ProductsManager = () => {
  const [checkOnSale, setCheckOnSale] = useState(false);

  const initialState = {
    title: "",
    price: 0,
    inStock: 0,
    description: "",
    content: "",
    category: "",
    onSale: false,
  };
  const [product, setProduct] = useState(initialState);

  const { title, price, inStock, description, content, category } = product;

  const [images, setImages] = useState([]);

  const { categories, auth, notify } = useCtx();

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setCheckOnSale(res.product.onSale);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  useEffect(() => {
    setProduct({ ...product, onSale: checkOnSale });
  }, [checkOnSale]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setProduct({ ...product, [name]: value });
    notify({});
  };

  const handleCheck = () => {
    setCheckOnSale(!checkOnSale);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (auth.user.role !== "admin")
      return notify({ error: "Authentication not valid." });

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

  return (
    <div className="products_manager">
      <NextSeo title={`${process.env.WEBSITE_NAME} | Create Product`} />
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Title"
            className="d-block my-4 w-100 p-2"
            onChange={handleChangeInput}
          />

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                min={0}
                placeholder="Price"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-sm-6">
              <label htmlFor="price">In Stock</label>
              <input
                type="number"
                name="inStock"
                value={inStock}
                min={0}
                placeholder="inStock"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <textarea
            name="description"
            id="description"
            cols="30"
            rows="3"
            placeholder="Description"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={description}
          />

          <textarea
            name="content"
            id="content"
            cols="30"
            rows="4"
            placeholder="Content"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={content}
          />

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <input
                  type="checkbox"
                  aria-label="Checkbox for on sale input"
                  onChange={handleCheck}
                  id="onSale"
                  name="onSale"
                  checked={checkOnSale}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              aria-label="Text input with checkbox"
              disabled
              value="On Sale?"
            />
          </div>

          <div className="input-group-prepend px-0 my-2">
            <select
              name="category"
              id="category"
              value={category}
              onChange={handleChangeInput}
              className="custom-select text-capitalize"
            >
              <option value="all">All Products</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-info my-2 px-4">
            {onEdit ? "Update" : "Create"}
          </button>
        </div>

        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Upload</span>
            </div>
            <div className="custom-file border rounded">
              <input
                type="file"
                className="custom-file-input"
                onChange={handleUploadInput}
                multiple
                accept="image/*"
              />
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

export default ProductsManager;
