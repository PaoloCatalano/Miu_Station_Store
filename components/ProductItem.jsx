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

  const nameCategory = categories
    .filter((category) => category._id === product.category)
    .map((item) => item.name);

  const { prodSWR, isLoading, isError } = useProduct(product._id);

  const userLink = () => {
    return (
      <div className="flex space-x-4">
        <Button
          className="grow animate-none"
          cta
          isDisabled={prodSWR?.product?.inStock === 0 ? true : false}
          onClick={() => addToCart(product, cart)}
        >
          <MdOutlineAddShoppingCart className="inline text-2xl -mt-2" /> Add
          Item
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
          className="!text-red-500 "
          onClick={() =>
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
  /*  w-[247.2px] */
  return (
    <div className=" relative flex flex-col max-w-md min-w-[247.2px]  rounded  my-5 p-2 overflow-hidden bg-gradient-to-b from-blue-200 via-slate-100 to-slate-200 ">
      <div className="uppercase text-md mb-2 font-bold text-slate-600">
        {product.title}
      </div>

      {noSalePage && auth.user && auth.user.role === "admin" && (
        <CheckBox
          isSelected={product.checked}
          className="absolute z-[1] top-2 "
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link href={`/product/${product._id}`} className="grow overflow-hidden">
        <div className="relative h-full">
          {product.onSale && (
            <div className="triangle z-[1] absolute -top-[7px] -right-[7px] float-left w-12 h-12 bg-rose-500/80 text-white rotate-45 text-center">
              <p className="mt-[5px]">sale</p>
            </div>
          )}
          <Image
            className="w-full h-full object-cover transition"
            src={product.images[0].url}
            alt={product.images[0].url}
            placeholder="blur"
            blurDataURL={rgbDataURL()}
            sizes="50vw"
            quality={100}
            width={200}
            height={200}
          />
        </div>
      </Link>
      <div>
        <div className="text-blue-400 text-right capitalize">
          {nameCategory}
        </div>

        <div className="flex flex-col items-center justify-start mt-3 mb-6">
          <div className="text-slate-600 font-bold text-4xl">
            €{product.price}
          </div>
          {prodSWR ? (
            prodSWR.product?.inStock > 0 ? (
              <div className="text-slate-500 text-xs">
                {prodSWR.product.inStock} in stock
              </div>
            ) : (
              <div className="text-red-500">Out Stock</div>
            )
          ) : (
            <div className="text-slate-400 text-xs">
              <span>{isLoading && "..."}</span>
              {!isError && `${product.inStock} in stock (may vary)`}
            </div>
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
