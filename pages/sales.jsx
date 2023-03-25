import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
import BgStatic from "components/BgStatic";
import Title from "components/Title";
import TitleImage from "components/TitleImage";
import pic from "public/images/logos/onSale.png";

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
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | On Sale`}
        canonical="https://miustationstore.netlify.app/sales"
        description="Here you can find all the Special Offers and product On Sale!"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | On Sale`,
          description:
            "Here you can find all the Special Offers and product On Sale!",
          url: "https://miustationstore.netlify.app/sales",
        }}
      />

      <BgStatic />
      <TitleImage image={pic} alt="products on sale" />

      <div className="my-10">
        {products.length === 0 ? (
          <Title>No Products</Title>
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
    </>
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
