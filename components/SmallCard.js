import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import { rgbDataURL } from "utils/blurData";

const ProductItem = ({ product }) => {
  const { categories } = useCtx();
  const router = useRouter();

  const noSalePage = router.pathname !== "/sales";

  const nameCategory = useCallback(
    categories
      .filter((category) => category._id === product.category)
      .map((item) => item.name)
  );

  return (
    <Link
      href={`/product/${product._id}`}
      className="group grow overflow-hidden"
    >
      <div className="relative flex flex-col w-[247.2px] md:max-w-md md:min-w-[247.2px]  rounded-md my-2 overflow-hidden shadow-none bg-slate-100 border-2 border-blue-200 transition md:w-80 hover:shadow-lg hover:border-blue-300">
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
          <div className="absolute w-full bottom-0 bg-white mb-4 pb-2 rounded border-2  scale-95 border-blue-200 group-hover:scale-90 transition group-hover:translate-y-2 group-hover:border-blue-300">
            <div className="font-sans uppercase text-left line-clamp-1 pl-3 mt-2 font-bold text-xl text-slate-600">
              {product.title}
            </div>
            <div className="text-xs text-left pl-4 text-slate-500 font-bold first-letter:capitalize">
              {nameCategory}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;