import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { rgbDataURL } from "utils/blurData";
import GoBack from "components/GoBack";
import fallbackPic from "public/images/logos/500.png";

export default function ErrorPage({ pic = fallbackPic }) {
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Page Not Found`}
        description="This page is currently not available"
      />
      <Image
        className="min-w-[243.2px] w-[30vw]"
        alt="error page miu station store"
        src={pic}
        placeholder="blur"
        blurDataURL={rgbDataURL()}
        quality={100}
        priority
      />

      <div className="text-miu-500 text-xl grow flex items-center">
        Sorry... this page is not available.
      </div>
      <Link href="/products?search=all" className="self-center">
        {/* CTA Button ~ */}
        <button className="my-3 text-white rounded max-w-xs transition-all  hover:ring-4 active:shadow-in focus:outline-none focus:ring-4 bg-gradient-to-br from-blue-400 to-miu-600 to-60% hover:ring-miu-400 focus:ring-miu-500 hover:to-70%">
          <div className="px-5 p-2 transition-all active:translate-x-[1px] active:translate-y-[1px]">
            Enjoy Shopping
          </div>
        </button>
      </Link>
      <GoBack />
    </>
  );
}
