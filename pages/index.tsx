import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { getData } from "utils/fetchData";
import BgAnimated from "components/BgAnimated";
import pic from "public/images/logos/logo.png";
import SmallCard from "components/SmallCard";
import Title from "components/Title";

const Home: NextPage = (props: { products: object }) => {
  const [products, setProducts] = useState<any>(props.products);

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} 🚉🛍️`}
        description={`Miu Station Store is an online shop selling fabulous handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.
`}
        canonical="https://miustationstore.netlify.app"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} 🚉🛍️`,
          description: `Miu Station Store is an online shop selling fabulous handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.`,
          url: "https://miustationstore.netlify.app",
        }}
      />
      <BgAnimated />
      <section className="my-10 container px-5">
        <article className="max-w-md mx-auto mb-10">
          <Title>Welcome to Miu Station Store</Title>

          <p className="text-slate-800 text-2xl pb-4">
            Online shop selling fabulous handmade items.
          </p>
          <p className="text-slate-800 text-2xl">
            Navigating through the product page, you will find stickers, dolls,
            clothes, kimonos, paintings, handcrafts, and much more.
          </p>
          <Link href="/products" className="cursor-pointer p-4 m-5 ">
            <p
              className="my-5 px-2
            font-bold text-rose-500 text-2xl"
            >
              Go to the Online Shop!
            </p>
          </Link>
          <Image
            placeholder="blur"
            src={pic}
            alt="miu station store"
            className="rounded max-w-[200px] mx-auto md:max-w-[300px]"
          />
        </article>
      </section>
      <section className="my-10 container px-1">
        <div className="font-sans text-5xl mb-8 font-bold md:text-6xl">
          Most sold products
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-6">
          {products.map((item) => (
            <div key={item.title}>
              <SmallCard product={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export async function getStaticProps() {
  const res = await getData("bestSeller");
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default Home;
