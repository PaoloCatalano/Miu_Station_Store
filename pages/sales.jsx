import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
// import Image from "next/image";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
import { rgbDataURL } from "utils/blurData";
// import product_pic from "public/onSale.png";
import GoBack from "components/GoBack";

const OnSale = (props) => {
  const [products, setProducts] = useState(props.products);

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };
  /**@TODO change vercel */
  return (
    <div className="home_page">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | On Sale`}
        canonical="https://miu-shop.vercel.app/sales"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | On Sale`,
          description:
            "Here you can find all the Special Offers and product On Sale!",
          url: "https://miu-shop.vercel.app/sales",
        }}
      />

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
        /> */}
      </div>
      <div className="_division mb-5"></div>

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
      <GoBack />
    </div>
  );
};

export async function getServerSideProps() {
  const res = await getData("productsOnSale");
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default OnSale;
