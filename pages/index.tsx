import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { getData } from "utils/fetchData";
import BgStatic from "components/BgStatic";
import Image from "next/image";
import pic from "public/images/logos/logo.png";
import Title from "components/Title";
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
      link: "/products?category=624afb102808cb15488d1fba",
      category: "Stickers",
      products: props.products.stickers,
    },
    {
      link: "/products?category=624afb102808cb15488d1fba",
      category: "Kimono",
      products: props.products.kimono,
    },
    {
      link: "/products?category=624b1f5809f7af00099f873e",
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
        <article className="bg-slate-50 border-2 border-blue-200 rounded p-5 pt-7 max-w-md mx-auto mb-10">
          <Title>Miu Station Store</Title>

          <p className="text-slate-600 text-2xl pb-4">
            Online shop for fabulous handmade products!
          </p>
          <p className="text-slate-600 text-lg mb-6">
            Here you will find stickers, dolls, clothes, kimonos, paintings,
            handcrafts, and much more.
          </p>
          <Link href="/products?search=all">
            {/* CTA Button ~ */}
            <button className="my-3 text-white rounded max-w-xs transition-all  hover:ring-4 active:shadow-in focus:outline-none focus:ring-4 bg-gradient-to-br from-blue-400 to-miu-600 to-60% hover:ring-miu-400 focus:ring-miu-500 hover:to-70%">
              <div className="px-5 p-2 transition-all active:translate-x-[1px] active:translate-y-[1px]">
                Shop Now
              </div>
            </button>
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
        <div className="text-3xl mb-8 font-bold md:text-6xl text-miu-500">
          Categories
        </div>
        {products?.map((prod) => (
          <Preview key={prod.category} {...prod} />
        ))}
        <Link href="/categories">
          <A>View All Categories</A>
        </Link>
      </section>
    </>
  );
};

export async function getServerSideProps() {
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
    // revalidate: 60, with getStaticProps()
  };
}

export default Home;
