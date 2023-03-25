import Link from "next/link";
import { NextSeo } from "next-seo";
import Image from "next/image";
import pic from "public/images/logos/oops.jpeg";
import { rgbDataURL } from "utils/blurData";
import GoBack from "./GoBack";
import Button from "./Button";

export default function NoProduct() {
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Page Not Available`}
        description="This page is currently not available"
      />
      <div className="flex items-center mx-auto animate-fade-in">
        <Image
          alt="Oops, page not available"
          src={pic}
          placeholder="blur"
          width={120}
          height={175}
          blurDataURL={rgbDataURL()}
          sizes="50vw"
        />
        <span className="text-2xl text-miu-600">
          Oops!, this page is no longer available
        </span>
      </div>
      <div className="animate-fade-in my-10 grow flex">
        <Link href="/products" className="self-center">
          <Button cta>Enjoy Shopping</Button>
        </Link>
      </div>
      <GoBack />
    </>
  );
}
