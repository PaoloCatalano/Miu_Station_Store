import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import { rgbDataURL } from "utils/blurData";
import { useProduct } from "utils/swr";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Button from "components/Button";
import CheckBox from "components/CheckBox";

const ProductItem = ({ product, handleCheck }) => {
  const { cart, auth, categories, addToCart, addModal } = useCtx();
  const router = useRouter();

  const noSalePage = router.pathname !== "/sales";

  const nameCategory = useCallback(
    categories
      .filter((category) => category._id === product.category)
      .map((item) => item.name)
  );

  const { prodSWR, isLoading, isError } = useProduct(product._id);

  const userLink = () => {
    return (
      <div className="flex space-x-4">
        <Button
          className="grow animate-none"
          cta
          isDisabled={prodSWR?.product?.inStock === 0 ? true : false}
          onPress={() => addToCart(product, cart)}
        >
          <MdOutlineAddShoppingCart className="inline text-2xl -mt-2" /> Add
        </Button>
        <Link href={`/product/${product._id}`}>
          <Button hipster>Info</Button>
        </Link>
      </div>
    );
  };

  const adminLink = () => {
    return (
      <div className="flex space-x-4">
        <Link className="grow" href={`/create/${product._id}`}>
          <Button className="w-full">
            <FaEdit className="inline text-2xl -mt-2" /> Edit
          </Button>
        </Link>
        <Button
          hipster
          className="!bg-red-300 hover:ring-red-200"
          onPress={() =>
            addModal([
              {
                data: "",
                id: product._id,
                title: product.title,
                type: "deleteProduct",
              },
            ])
          }
        >
          Delete
        </Button>
      </div>
    );
  };
  /**@TODO md:max-w-md md:custom-min-width works?? */
  return (
    <div className="group relative flex flex-col w-60 md:max-w-md md:custom-min-width rounded my-2 overflow-hidden shadow-none bg-slate-100 border-2 border-blue-200 transition md:w-80 hover:shadow-lg hover:border-blue-300">
      {noSalePage && auth.user && auth.user.role === "admin" && (
        <CheckBox
          aria-label="checkbox"
          isSelected={product.checked}
          className="absolute z-[1] top-2 left-2"
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link href={`/product/${product._id}`} className="grow overflow-hidden">
        <div className="relative h-full max-h-96">
          {product.onSale && (
            <div className="triangle z-[1] absolute -top-[8px] -right-[8px] float-left w-12 h-12 bg-rose-500/80 text-white rotate-45 text-center">
              <p className="mt-[7px] text-sm">sale</p>
            </div>
          )}
          <Image
            className="w-full h-full object-cover transition rounded-md-t group-hover:scale-105"
            src={product.images[0].url}
            alt={product.images[0].url}
            placeholder="blur"
            blurDataURL={rgbDataURL()}
            sizes="50vw"
            quality={100}
            width={200}
            height={200}
            priority
          />
        </div>
      </Link>

      <div className="font-sans uppercase text-left line-clamp-1 pl-3 mt-2 font-bold text-xl text-slate-600">
        {product.title}
      </div>
      <div className="text-xs text-left pl-4 text-slate-400 font-bold first-letter:capitalize">
        {nameCategory}
      </div>

      <div className="p-2">
        <div className="flex flex-row items-center justify-between my-auto px-2 py-2">
          {prodSWR ? (
            prodSWR.product?.inStock > 0 ? (
              <>
                <div
                  className={`${
                    product.onSale
                      ? "text-rose-500 after:content-['_Sale!'] z-10 after:text-sm before:block before:absolute before:-inset-1 before:-z-10 before:-skew-y-3 before:bg-rose-200 before:animate-boeing-once relative inline-block"
                      : "text-slate-500 font-bold"
                  } `}
                >
                  <span className="text-sm font-normal mr-px">€</span>
                  {product.price}
                </div>
                <div
                  className={`${
                    prodSWR.product?.inStock === 1
                      ? "text-red-500"
                      : "text-slate-500"
                  } text-xs z-10`}
                >
                  {prodSWR.product.inStock} in stock
                </div>
              </>
            ) : (
              <div className="text-red-500 ">Out of Stock</div>
            )
          ) : (
            <>
              <div
                className={`${
                  product.onSale ? "text-rose-500" : "text-slate-600"
                }`}
              >
                <span className="text-sm mr-px">€</span>
                {product.price}
              </div>
              {isLoading && <span>...</span>}
              <div className="text-slate-400 text-xs">
                {isError && `${product.inStock} in stock`}
              </div>
            </>
          )}
        </div>

        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
