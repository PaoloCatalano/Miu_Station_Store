import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
import filterSearch from "utils/filterSearch";
import Filter from "components/Filter";
// import CardLink from "components/CardLink";
import { rgbDataURL } from "utils/blurData";
// import product_pic from "public/products.png";

const Home = (props) => {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const router = useRouter();

  const { auth, page, addModal } = useCtx();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0 /* setPage(1) */);
  }, [router.query]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckALL = () => {
    products.forEach((product) => (product.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
    setIsAll(!isAll);
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: `${
            isAll
              ? "___WARNING___ Delete ALL products?"
              : "Delete selected products?"
          }`,
          type: "deleteProduct",
        });
      }
    });

    addModal(deleteArr);
    /**@TODO refresh the page after deleting */
    // return router.reload();
  };

  const handleLoadmore = () => {
    // setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  return (
    <div className="home_page">
      <NextSeo
        canonical="https://miu-shop.vercel.app/"
        openGraph={{
          url: "https://miu-shop.vercel.app/",
        }}
      />

      {/* <CardLink /> */}

      <div className="_image-container">
        {/* <Image
          className="rounded"
          alt="logo miu shop"
          src={product_pic}
          layout="intrinsic"
          placeholder="blur"
          width={510}
          height={382.5}
          blurDataURL={rgbDataURL()}
          quality={100}
          priority
        /> */}
      </div>
      <div className="_division mb-5" id="products"></div>

      <Filter />

      {auth.user && auth.user.role === "admin" && (
        <div
          className="delete_all btn btn-danger mt-2"
          style={{ marginBottom: "-10px" }}
        >
          <input
            type="checkbox"
            checked={isCheck}
            onChange={handleCheckALL}
            style={{
              width: "25px",
              height: "25px",
              transform: "translateY(8px)",
            }}
          />

          <button
            className="btn bg-red-500 ml-2"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            {isAll ? "DELETE ALL" : "Delete"}
          </button>
        </div>
      )}

      <div className="products">
        {products.length === 0 ? (
          <h2>No Products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            />
          ))
        )}
      </div>

      {props.result < page * 6 ? (
        ""
      ) : (
        <button
          className="btn btn-outline-info d-block mx-auto mb-4"
          onClick={handleLoadmore}
        >
          Load more
        </button>
      )}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&sort=${sort}&title=${search}`
  );
  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

export default Home;
