import { useState, useEffect } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
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
      <TitleImage image={pic} alt="products on sale" />

      <div className="container my-10 flex flex-row flex-wrap gap-5 items-center justify-center">
        {products.length === 0 ? (
          <div className="text-xl">
            <p>No Products available On Sale in this moment.</p>
            <div className="animate-fade-in my-10 w-full">
              <Link href="/products?search=all" className="self-center">
                {/* CTA Button ~ */}
                <button className="my-3 text-white rounded max-w-xs transition-all  hover:ring-4 active:shadow-in focus:outline-none focus:ring-4 bg-gradient-to-br from-blue-400 to-miu-600 to-60% hover:ring-miu-400 focus:ring-miu-500 hover:to-70%">
                  <div className="px-5 p-2 transition-all active:translate-x-[1px] active:translate-y-[1px]">
                    Keep Shopping
                  </div>
                </button>
              </Link>
            </div>
          </div>
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
