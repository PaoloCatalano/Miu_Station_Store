import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import BgBlue from "components/BgBlue";
import pic from "public/images/logos/logo.png";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} 🚉`}
        description={`Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.
`}
        canonical="https://miustationstore.netlify.app"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} 🚉`,
          description: `Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.`,
          url: "https://miustationstore.netlify.app",
        }}
      />
      <BgBlue />
      <h1 className="text-5xl font-bold md:text-6xl">
        Welcome to Miu Station Store
      </h1>

      <p className="mt-3 font-bold text-rose-700 text-2xl">
        Get started with your purchase!
      </p>
      <Link href="/products" className="cursor-pointer p-4 m-5">
        <Image
          placeholder="blur"
          src={pic}
          alt="miu station store"
          className="rounded w-[50vw] h-[50wh] md:max-w-[400px] hover:brightness-110 transition-all"
        />
      </Link>
    </>
  );
};

export default Home;
