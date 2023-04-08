import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { getData } from "utils/fetchData";
import BgBlue from "components/BgBlue";
import pic from "public/images/logos/logo.png";
import SmallCard from "components/SmallCard";

const Home: NextPage = (props: { products: object }) => {
  const [products, setProducts] = useState<any>(props.products);

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} 🚉🛍️`}
        description={`Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.
`}
        canonical="https://miustationstore.netlify.app"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} 🚉🛍️`,
          description: `Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.`,
          url: "https://miustationstore.netlify.app",
        }}
      />
      <BgBlue />
      <h1 className="text-5xl mb-8 font-bold md:text-6xl">
        Welcome to Miu Station Store
      </h1>

      <p
        className="my-5 px-2
       font-bold text-rose-700 text-2xl"
      >
        Get started with your purchase by clicking the icon!
      </p>
      <Link href="/products" className="cursor-pointer p-4 m-5">
        <Image
          placeholder="blur"
          src={pic}
          alt="miu station store"
          className="rounded max-w-[200px] md:max-w-[300px] hover:brightness-110 transition-all shadow-lg animate-boeing-once"
        />
      </Link>
      <section>
        {products.map((item) => (
          <div key={item.title}>
            <SmallCard product={item} />
          </div>
        ))}
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
