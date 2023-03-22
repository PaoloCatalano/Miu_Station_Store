import { useState } from "react";
import { NextSeo, ProductJsonLd } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import NoProduct from "components/NoProduct";
import { getData } from "utils/fetchData";
import { useCtx } from "store/globalState";
import { rgbDataURL } from "utils/blurData";
import { useProduct } from "utils/swr";
import GoBack from "components/GoBack";
import Button from "components/Button";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const SingleProduct = (props) => {
  if (props.product === null) {
    return <NoProduct />;
  }
  const { cart, categories, addToCart } = useCtx();

  const prodID = props.product._id;

  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);

  const nameCategory = categories
    .filter((category) => category._id === product.category)
    .map((item) => item.name);
  //SWR
  const { prodSWR, isLoading, isError } = useProduct(prodID);

  const isActive = (index) => {
    if (tab === index) return " border-2 border-blue-200";
    return "";
  };
  /**@TODO change vercel */
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | ${product.title.toUpperCase()}`}
        description={product.description + ", " + product.content}
        canonical={`https://miu-shop.vercel.app/product/${product._id}`}
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | ${product.title.toUpperCase()}`,
          url: `https://miu-shop.vercel.app/product/${product._id}`,
          images: [
            {
              url: `${process.env.BASE_URL}/_next/image?url=${product.images[0].url}&w=3840&q=100`,
              width: 1000,
              height: 1000,
              alt: product.title,
            },
          ],
        }}
      />
      {/**@TODO change vercel  */}
      <ProductJsonLd
        productName={product.title}
        images={product.images.map((i) => i.url)}
        description={product.description}
        manufacturerName="Miu Shop"
        manufacturerLogo="https://miu-shop.vercel.app/icon.png"
        disambiguatingDescription={product.content}
        releaseDate={product.updatedAt}
        productionDate={product.createdAt}
        offers={[
          {
            price: product.price,
            priceCurrency: "EUR",
            priceValidUntil: "2030-12-05",
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            url: `https://miu-shop.vercel.app/product/${product._id}`,
            seller: {
              name: "Miu Shop",
            },
          },
        ]}
      />
      <section className="relative w-full container px-1 flex flex-col items-center justify-center gap-5 md:flex-row md:items-start md:space-x-10">
        <aside className="top-1 md:sticky ">
          <div className="relative">
            <Image
              className="mx-auto rounded mt-4 w-100"
              src={product.images[tab].url}
              alt={product.images[tab].url}
              // objectFit="contain"
              placeholder="blur"
              blurDataURL={rgbDataURL()}
              sizes="50vw"
              quality={100}
              width={600}
              height={600}
            />
          </div>

          <div className="flex flex-wrap mx-0 ">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img.url}
                alt={img.url}
                className={`cursor-pointer rounded mr-1 mt-1 ${isActive(
                  index
                )}`}
                width={60}
                height={65}
                onClick={() => setTab(index)}
              />
            ))}
          </div>
        </aside>
        <div className="mt-10 md:mt-4 ">
          <article className=" border-2 border-blue-300 bg-slate-50 rounded w-full min-w-[247.2px] md:max-w-md">
            <div className="uppercase text-center my-5 text-2xl text-sky-700">
              {product.title}
            </div>
            <div className="text-xl my-5 text-slate-500">
              Price:{" "}
              <span className="text-slate-700 font-bold">
                € {product.price}
              </span>
              <p>
                {product.onSale && <i className="text-rose-500"> On Sale!</i>}
              </p>
            </div>
            <div className="text-slate-500">
              {prodSWR ? (
                prodSWR.product.inStock > 0 ? (
                  <div>
                    <span className="text-slate-700">
                      {prodSWR.product.inStock}
                    </span>{" "}
                    in stock
                  </div>
                ) : (
                  <div className="text-red-500">Out of Stock</div>
                )
              ) : (
                <div className="text-slate-500">
                  {isLoading && <p>...</p>}
                  {isError && <p>{product.inStock} in stock (may vary)</p>}
                </div>
              )}

              {prodSWR ? (
                <div>
                  {" "}
                  <span className="text-slate-700">
                    {prodSWR.product.sold}
                  </span>{" "}
                  sold
                </div>
              ) : (
                <div className="text-slate-500">
                  {isLoading && <p>...</p>}
                  {product.sold} sold
                </div>
              )}
            </div>
            <div className="my-10">
              {product.inStock > 0 && (
                <Button
                  className="animate-none"
                  cta
                  isDisabled={prodSWR?.product?.inStock === 0 ? true : false}
                  onClick={() => addToCart(product, cart)}
                >
                  <MdOutlineAddShoppingCart className="inline text-2xl -mt-2" />{" "}
                  Add Item
                </Button>
              )}
              <div className="mt-6">
                <Link
                  href="/cart"
                  className="my-3 px-5 ring-2 ring-miu-500 rounded p-2 text-miu-500 transition hover:ring-4 hover:text-miu-600"
                >
                  Go to Cart
                </Link>
              </div>
            </div>
            {/* Description */}
            <div className="mt-10 p-5 bg-gradient-to-b from-transparent to-blue-200 rounded">
              <div className="my-2 uppercase text-sky-700 text-xl">
                {product.description}
              </div>
              <div className="my-2  first-letter:uppercase text-slate-700">
                {product.content}
              </div>
            </div>
          </article>
          <article>
            <div className="my-10 ">
              <span>Category: </span>
              <Link href={`/products?category=${product.category}`}>
                <Button hipster className="capitalize">
                  {nameCategory}
                </Button>
              </Link>
            </div>
          </article>
        </div>
      </section>
      <div className="w-full px-6">
        <GoBack />
      </div>
    </>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);

  // if (res.err) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { product: res.product || null, err: res.err || null },
  };
}

export default SingleProduct;
