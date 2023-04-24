import { Product } from "utils/types";
import SmallCard from "components/SmallCard";
import MoreItems from "components/MoreItems";

export default function Preview({
  category,
  products,
  link,
}: {
  category: string;
  products: Product[];
  link: string;
}) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-6 mb-20">
      <div className="font-sans w-60 text-2xl text-slate-600 text-center">
        {category}
      </div>
      {products.map((item) => (
        <div key={item._id}>
          <SmallCard product={item} />
        </div>
      ))}
      <MoreItems link={link}>more {category}</MoreItems>
    </div>
  );
}
