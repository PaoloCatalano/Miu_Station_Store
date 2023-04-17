import Image from "next/image";

export default function TitleImage({ image, alt = "" }) {
  return (
    <div className="flex border-b-2 border-miu-600 mb-10 overflow-hidden ">
      <Image
        className="animate-up transition md:hover:translate-y-16 w-28 h-20 md:w-52 md:h-36"
        alt={`miu station store ${alt}`}
        src={image}
        placeholder="blur"
        blurDataURL={`data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`}
        sizes="50vw"
      />
    </div>
  );
}
