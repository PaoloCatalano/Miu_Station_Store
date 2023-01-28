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
    if (tab === index) return " active";
    return "";
  };
  /**@TODO change vercel */
  return (
    <div className="row detail_page">
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

      <div className="col-md-6 ">
        <div className="position-relative image-container">
          <Image
            className="d-block img-thumbnail rounded mt-4 w-100"
            src={product.images[tab].url}
            alt={product.images[tab].url}
            // objectFit="contain"
            placeholder="blur"
            blurDataURL={rgbDataURL()}
            sizes="50vw"
            quality={100}
            width={100}
            height={100}
          />
        </div>

        <div className="row mx-0" style={{ cursor: "pointer" }}>
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img.url}
              alt={img.url}
              className={`img-thumbnail rounded mr-1 mt-1 ${isActive(index)}`}
              width={60}
              height={65}
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>

      <div className="col-md-6 mt-3">
        <h2 className="text-uppercase text-center">{product.title}</h2>
        <div className="_division mb-5"></div>
        <h5 className="text-info">
          Price: <span className="_info-bold">€ {product.price}</span>{" "}
          {product.onSale && <i className="text-danger"> On Sale!</i>}
        </h5>
        <div className="row mx-0 d-flex justify-content-between">
          {prodSWR ? (
            prodSWR.product.inStock > 0 ? (
              <h6 className="text-secondary">
                In Stock: {prodSWR.product.inStock}
              </h6>
            ) : (
              <h6 className="text-red-500">Out Stock</h6>
            )
          ) : (
            <h6 className="text-red-500">
              <span>{isLoading && "⌛"}</span>
              {isError && `maybe in Stock: ${product.inStock}`}
            </h6>
          )}

          {prodSWR ? (
            <h6 className="text-secondary">Sold: {prodSWR.product.sold}</h6>
          ) : (
            <h6 className="text-secondary">
              Sold {product.sold}?<span>{isLoading && "⌛"}</span>
            </h6>
          )}
        </div>
        <div className="d-inline-flex align-items-baseline ">
          <h5 className="text-info mt-4 mr-2">Category:</h5>
          <Link href={`/?category=${product.category}#products`}>
            <div className="btn btn-outline-info text-capitalize">
              {nameCategory}
            </div>
          </Link>
        </div>
        <div className="mb-5 _callout rounded">
          <h5 className="my-2 text-capitalize">{product.description}</h5>
          <div className="my-2 text-muted ">{product.content}</div>
        </div>
        {product.inStock <= 0 ? (
          <button
            type="button"
            className="btn btn-secondary d-block my-3 px-5"
            disabled={true}
            style={{ cursor: "not-allowed" }}
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-info d-block my-3 px-5"
            disabled={prodSWR?.product.inStock === 0 ? true : false}
            onClick={() => addToCart(product, cart)}
          >
            {/* <AddButton /> */}add to cart
          </button>
        )}
        <GoBack />
        <Link href="/cart">
          <button type="button" className="btn btn-warning d-block my-3 px-5">
            Go to Cart
          </button>
        </Link>
      </div>
    </div>
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
