import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Miu Station Store 🚉</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl font-bold md:text-6xl">
        Welcome to Miu Station Store
      </h1>

      <p className="mt-3 text-2xl">Get started with your purchase!</p>
    </>
  );
};

export default Home;
