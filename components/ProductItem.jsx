import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import { rgbDataURL } from "utils/blurData";
import { useProduct } from "utils/swr";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import Button from "components/Button";

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
          <MdOutlineAddShoppingCart className="mx-auto text-2xl" />
        </Button>
        <Link href={`/product/${product._id}`}>
          <Button hipster>Info</Button>
        </Link>
      </div>
    );
  };

  const adminLink = () => {
    return (
      <>
        <Link href={`/create/${product._id}`}>
          <div className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
            Edit
          </div>
        </Link>
        <button
          className="btn bg-red-500"
          style={{ marginLeft: "5px", flex: 1 }}
          data-toggle="modal"
          data-target="#exampleModal"
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
        </button>
      </>
    );
  };
  return (
    <div className="w-[247.2px] rounded border-2 border-slate-500 my-5 p-2  shadow-md">
      <div className="uppercase text-md mb-2">{product.title}</div>

      {noSalePage && auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={product.checked}
          className="position-absolute"
          style={{ height: "20px", width: "20px", zIndex: 1 }}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link href={`/product/${product._id}`}>
        <div className="relative">
          {product.onSale && (
            <div className="triangle z-[1] absolute -top-[7px] -right-[7px] float-left w-12 h-12 bg-slate-500/80 text-white rotate-45 text-center">
              <p className="mt-1">sale</p>
            </div>
          )}
          <Image
            className="w-full h-full object-cover"
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
      <div className="">
        <div className="text-slate-500 text-right capitalize">
          {nameCategory}
        </div>

        <div className="flex flex-col items-center justify-start mt-3 mb-6">
          <h6 className="text-slate-600 font-bold text-4xl">
            €{product.price}
          </h6>
          {prodSWR ? (
            prodSWR.product?.inStock > 0 ? (
              <div className="text-slate-500 text-xs">
                {prodSWR.product.inStock} in stock
              </div>
            ) : (
              <div className="text-red-500">Out Stock</div>
            )
          ) : (
            <h6 className="text-danger">
              <span>{isLoading && "..."}</span>
              {isError && `${product.inStock} in stock`}
            </h6>
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
