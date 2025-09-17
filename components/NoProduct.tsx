import Link from "next/link";
import { NextSeo } from "next-seo";
import Image from "next/image";
import pic from "public/images/logos/oops.jpeg";
import { rgbDataURL } from "utils/blurData";
import GoBack from "./GoBack";

export default function NoProduct() {
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Page Not Available`}
        description="This page is currently not available"
      />
      <div className="flex items-center mx-auto animate-fade-in">
        <div className="relative w-32 h-44 ml-px">
          <Image
            alt="Oops, page not available"
            src={pic}
            placeholder="blur"
            fill
            blurDataURL={rgbDataURL()}
            sizes="50vw"
            className="object-contain rounded"
          />
        </div>
        <span className="text-2xl text-miu-600">
          Oops!, this page is no longer available
        </span>
      </div>
      <div className="animate-fade-in my-10 grow flex">
        <Link href="/products?search=all" className="self-center">
          {/* CTA Button ~ */}
          <button className="my-3 text-white rounded max-w-xs transition-all  hover:ring-4 active:shadow-in focus:outline-none focus:ring-4 bg-gradient-to-br from-blue-400 to-miu-600 to-60% hover:ring-miu-400 focus:ring-miu-500 hover:to-70%">
            <div className="px-5 p-2 transition-all active:translate-x-[1px] active:translate-y-[1px]">
              View Products
            </div>
          </button>
        </Link>
      </div>
      <GoBack />
    </>
  );
}
