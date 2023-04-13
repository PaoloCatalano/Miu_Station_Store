import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { getData } from "utils/fetchData";
import BgStatic from "components/BgStatic";
import pic from "public/images/logos/logo.png";
import Title from "components/Title";
import Button from "components/Button";
import Preview from "components/Preview";
import A from "components/A";

const Home: NextPage = (props: {
  products: { stickers: object; kimono: object; accessories: object };
}) => {
  const [products, setProducts] = useState<Data>(null);

  useEffect(() => {
    setProducts(data);
  }, [props.products]);

  const data: Data = [
    {
      link: "/product?category=624afb102808cb15488d1fba",
      category: "Stickers",
      products: props.products.stickers,
    },
    {
      link: "/product?category=624afb102808cb15488d1fba",
      category: "Kimono",
      products: props.products.kimono,
    },
    {
      link: "/product?category=624b1f5809f7af00099f873e",
      category: "Accessories",
      products: props.products.accessories,
    },
  ];

  type Data = {
    link: string;
    category: string;
    products: object;
  }[];

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
      <BgStatic />
      <section className="my-10 container px-5">
        <article className="bg-slate-50 border-2 border-animation-color rounded p-5 pt-7 max-w-md mx-auto mb-10">
          <Title>Miu Station Store</Title>

          <p className="text-slate-600 text-2xl pb-4">
            Online shop for fabulous handmade products!
          </p>
          <p className="text-slate-600 text-lg mb-6">
            Here you will find stickers, dolls, clothes, kimonos, paintings,
            handcrafts, and much more.
          </p>
          <Link href="/products" className="cursor-pointer p-4 m-5 ">
            <Button cta>Shop Now</Button>
          </Link>
          {/* <Image
            placeholder="blur"
            src={pic}
            alt="miu station store"
            className="rounded max-w-[200px] mx-auto md:max-w-[300px]"
          /> */}
        </article>
      </section>
      <section className="my-10 container px-1">
        <div className="text-2xl mb-8 font-bold md:text-6xl text-miu-500">
          Categories
        </div>
        {products?.map((prod) => (
          <Preview key={prod.category} {...prod} />
        ))}
        <Link href="/categories">
          <A>All Categories</A>
        </Link>
      </section>
    </>
  );
};

export async function getStaticProps() {
  const stickers = await getData(
    "product?limit=2&category=6248c34a9695eb0009ac13b8&showInStock=&sort=&title=all"
  );
  const kimono = await getData(
    "product?limit=2&category=624afb102808cb15488d1fba&showInStock=false&sort=&title=all"
  );
  const accessories = await getData(
    "product?limit=2&category=624b1f5809f7af00099f873e&showInStock=&sort=&title=all"
  );
  return {
    props: {
      products: {
        stickers: stickers.products,
        kimono: kimono.products,
        accessories: accessories.products,
      },
    },
  };
}

export default Home;
