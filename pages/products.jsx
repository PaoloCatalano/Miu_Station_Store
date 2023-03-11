import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";

import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineNewLabel } from "react-icons/md";
import { useCtx } from "store/globalState";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
import filterSearch from "utils/filterSearch";
import Filter from "components/Filter";
import CheckBox from "components/CheckBox";
import pic from "public/images/logos/products.png";
import Button from "components/Button";
import BgStatic from "components/BgStatic";
import TitleImage from "components/TitleImage";

const Products = (props) => {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const { auth, addModal } = useCtx();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (router.query && !router.query.page) setPage(1);

    if (router.query?.page) setPage(Number.parseInt(router.query.page));
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
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: "Delete selected products?",
          type: "deleteProduct",
        });
      }
    });

    addModal(deleteArr);
    /**@TODO refresh the page after deleting */
    // return router.reload();
  };

  const handleLoadMore = () => {
    // setPage((page) => page + 1);
    filterSearch({ router, page: page + 1 });
  };

  return (
    <>
      <NextSeo
        canonical="https://miu-shop.vercel.app/"
        openGraph={{
          url: "https://miu-shop.vercel.app/",
        }}
      />
      <BgStatic />

      <TitleImage image={pic} alt="products" />
      <section className="relative w-full container flex flex-col items-center justify-center gap-5 px-1 md:flex-row md:items-start md:space-x-10">
        <aside className="top-1 md:pl-4 md:sticky">
          {auth.user && auth.user.role === "admin" && (
            <Link href="/create">
              <Button>
                <MdOutlineNewLabel className="mx-auto my-1 text-3xl" />
                Create New Product
              </Button>
            </Link>
          )}
          <Filter />
        </aside>
        <div className="grow">
          <div className="flex flex-wrap justify-center md:justify-evenly gap-8">
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
        </div>
      </section>

      <section className="my-10">
        <Button
          isDisabled={props.result < page * 6}
          className="animate-none"
          onClick={handleLoadMore}
        >
          Load more
        </Button>
      </section>
      {auth.user && auth.user.role === "admin" && (
        <section className="bg-red-200 w-11/12 max-w-screen-lg py-10 px-6 rounded space-y-5">
          <h1 className="text-center text-2xl">Danger Zone</h1>
          <div className="w-100 flex-col space-y-4">
            <CheckBox isSelected={isCheck} onChange={handleCheckALL}>
              Delete All Products
            </CheckBox>

            <Button hipster onClick={handleDeleteAll} className="!bg-red-400">
              DELETE
            </Button>
          </div>
        </section>
      )}
    </>
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

export default Products;
