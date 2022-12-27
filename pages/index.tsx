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

      <main className="main">
        <h1 className="text-6xl font-bold">Welcome to Miu Station Store</h1>

        <p className="mt-3 text-2xl">Get started with your purchase!</p>
      </main>
    </>
  );
};

export default Home;
