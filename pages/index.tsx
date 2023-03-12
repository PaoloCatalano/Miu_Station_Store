import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import BgBlue from "components/BgBlue";
import pic from "public/images/logos/logo.png";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Miu Station Store 🚉</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BgBlue />
      <h1 className="text-5xl font-bold md:text-6xl">
        Welcome to Miu Station Store
      </h1>

      <p className="mt-3 font-bold text-rose-600 text-2xl">
        Get started with your purchase!
      </p>
      <Link href="/products" className="cursor-pointer p-4 m-5">
        <Image
          src={pic}
          alt="miu station store"
          className="rounded w-[50vw] h-[50wh] md:max-w-[400px] hover:brightness-110 transition-all"
        />
      </Link>
    </>
  );
};

export default Home;
