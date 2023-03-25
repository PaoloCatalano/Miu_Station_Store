import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { rgbDataURL } from "utils/blurData";
import GoBack from "components/GoBack";
import Button from "components/Button";
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
      <Link href="/products">
        <Button cta>Enjoy Shopping</Button>
      </Link>
      <GoBack />
    </>
  );
}
