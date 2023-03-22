import Image from "next/image";
import { rgbDataURL } from "utils/blurData";

export default function TitleImage({ image, alt = "" }) {
  return (
    <div className="flex border-b-2 border-miu-600 mb-10 overflow-hidden">
      <Image
        className="w-28  animate-up transition hover:translate-y-9 md:w-52 md:hover:translate-y-16"
        alt={`miu station store ${alt}`}
        src={image}
        placeholder="blur"
        blurDataURL={`data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`}
        sizes="50vw"
      />
    </div>
  );
}
