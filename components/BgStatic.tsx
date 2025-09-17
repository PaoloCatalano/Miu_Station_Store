import Image from "next/image";
import pic from "public/images/bg/lines.png";
import { rgbDataURL } from "utils/blurData";

export default function BgStatic() {
  return (
    <>
      <div className="fading-bg absolute inset-0 h-screen -z-40 "></div>

      <div className="absolute inset-0 -z-50  bg-fixed bg-cover animate-fade-in">
        <Image
          className="w-full h-full object-cover transition"
          src={pic}
          alt="Miu Station Products background"
          placeholder="blur"
          blurDataURL={rgbDataURL()}
          sizes="100vw"
          quality={100}
          fill
          priority
        />
      </div>
    </>
  );
}

//pic from https://pattern.monster/waves-1/
