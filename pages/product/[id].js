import { useState, useCallback, useEffect } from "react";
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
import BgStatic from "components/BgStatic";
import A from "components/A";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const SingleProduct = (props) => {
  if (props.product === null) {
    return <NoProduct />;
  }
  const {
    cart,
    categories,
    addToCart,
    isLoading: isLoading_globalState,
    loading,
  } = useCtx();

  const prodID = props.product._id;

  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);
  const [tabVisited, setTabVisited] = useState([]);

  const nameCategory = useCallback(
    categories
      .filter((category) => category._id === product.category)
      .map((item) => item.name)
  );

  useEffect(() => {
    if (!tabVisited.includes(tab)) isLoading_globalState(true);

    setTabVisited(() => {
      if (tabVisited.includes(tab)) {
        return tabVisited;
      } else {
        return [...tabVisited, tab];
      }
    });
  }, [tab]);

  //SWR
  const { prodSWR, isLoading, isError } = useProduct(prodID);

  const isActive = (index) => {
    if (tab === index)
      return "!rounded !brightness-100 !cursor-default border-2 border-blue-300";
    return "";
  };

  return (
    <>
      <NextSeo
        title={`${
          process.env.WEBSITE_NAME
        } | ${product.title.toUpperCase()} | ${nameCategory}`}
        description={
          nameCategory + ", " + product.description + ", " + product.content
        }
        canonical={`https://miustationstore.netlify.app/product/${product._id}`}
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | ${product.title.toUpperCase()}`,
          url: `https://miustationstore.netlify.app/product/${product._id}`,
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
      <ProductJsonLd
        productName={product.title}
        images={product.images.map((i) => i.url)}
        description={product.description}
        manufacturerName="Miu Station Store"
        manufacturerLogo="https://miustationstore.netlify.app/images/logos/icon.png"
        disambiguatingDescription={product.content}
        releaseDate={product.updatedAt}
        productionDate={product.createdAt}
        offers={[
          {
            price: product.price,
            priceCurrency: "EUR",
            priceValidUntil: "2050-12-05",
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            url: `https://miustationstore.netlify.app/product/${product._id}`,
            seller: {
              name: "Miu Station Store",
            },
          },
        ]}
      />

      <BgStatic />

      <section className="relative w-full container px-1 flex flex-col items-center justify-center gap-5 md:flex-row md:items-start md:space-x-10">
        <aside className="top-1 md:sticky ">
          <div className="relative">
            <Image
              className="mx-auto rounded mt-4 w-100"
              src={product.images[tab].url}
              alt={product.title}
              placeholder="blur"
              blurDataURL={rgbDataURL()}
              quality={100}
              width={600}
              height={600}
              priority
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              onLoadingComplete={() => isLoading_globalState(false)}
            />
          </div>

          <div className="flex flex-wrap mx-0 ">
            {product.images.map((img, index) => (
              <div
                onClick={() => setTab(index)}
                className={`relative cursor-pointer mt-1 rounded-sm mr-1 w-[60px] h-16 brightness-75 hover:ring-2 hover:ring-blue-200 hover:brightness-100 transition  ${isActive(
                  index
                )}`}
                key={img.public_id}
              >
                <Image
                  src={img.url}
                  alt={`thumbnail for ${product.title} (${img.public_id})`}
                  className="object-cover rounded-sm"
                  fill
                  sizes="10vw"
                />
              </div>
            ))}
          </div>
        </aside>
        <div className="mt-10 md:mt-4">
          <article className=" border-2 border-blue-300 bg-slate-100 rounded w-full custom-min-width md:max-w-md">
            <div className="font-sans uppercase text-center my-5 text-2xl text-sky-700">
              {product.title}
            </div>
            <div className="text-xl my-5 text-slate-600">
              Price:{" "}
              <span className="text-slate-700 font-bold">
                <span className="text-lg mr-1">€</span>
                {product.price}
              </span>
              <p>
                {product.onSale && <i className="text-rose-500"> On Sale!</i>}
              </p>
            </div>
            <div className="text-slate-600">
              {prodSWR ? (
                prodSWR.product.inStock > 0 ? (
                  <div>
                    <span className="text-slate-700">
                      {prodSWR.product.inStock}
                    </span>{" "}
                    in stock
                  </div>
                ) : (
                  <div className="text-red-600">Out of Stock</div>
                )
              ) : (
                <div className="text-slate-600">
                  {isLoading && (
                    <div className="mx-auto my-4 h-4 rounded w-20 bg-slate-300 animate-pulse"></div>
                  )}
                  {isError && (
                    <div className="text-slate-400 text-xs">
                      {product.inStock} in stock
                    </div>
                  )}{" "}
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
                <div className="text-slate-600">
                  {isLoading ? (
                    <div className="mx-auto my-4 h-4 rounded w-20 bg-slate-300 animate-pulse"></div>
                  ) : (
                    <> {product.sold} sold </>
                  )}
                </div>
              )}
            </div>
            <div className="my-10">
              {product.inStock > 0 && (
                <Button
                  className="animate-none"
                  cta
                  isDisabled={prodSWR?.product?.inStock === 0 ? true : false}
                  onPress={() => addToCart(product, cart)}
                >
                  <MdOutlineAddShoppingCart className="inline text-2xl -mt-2" />{" "}
                  Add Item
                </Button>
              )}
              <div className="mt-6">
                <Link href="/cart">
                  <A>Go to cart</A>
                </Link>
              </div>
            </div>
            {/* Description */}
            <div className="mt-10 p-5 bg-gradient-to-b from-transparent to-blue-200 rounded-sm">
              <div className="my-2 mb-6 uppercase text-sky-700 text-lg">
                {product.description}
              </div>
              <div className="my-2 text-left first-letter:uppercase text-slate-700 whitespace-break-spaces">
                {product.content}
              </div>
            </div>
          </article>
          <article>
            <div className="my-10 px-4 bg-slate-50 rounded border-2 border-slate-100">
              <span className="text-slate-700">Category: </span>
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
