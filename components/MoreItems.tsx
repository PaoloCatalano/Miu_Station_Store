import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export default function MoreItems({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="group relative w-60 h-60 rounded-md border-2 border-slate-200 shadow-none bg-slate-100 hover:border-slate-300 transition overflow-hidden hover:shadow-lg">
        <div className="absolute bottom-0 bg-white border-t-2 border-slate-200 w-full h-[77px] group-hover:h-[69px] transition-all">
          <div className="w-full">
            <div className="rounded-full grid place-items-center aspect-square w-14 bg-white border-2 border-slate-300 -translate-y-7 mx-auto shadow-sm group-hover:w-16 group-hover:-translate-y-8 group-hover:shadow-lg transition-all">
              <FaChevronRight className="text-miu-500 text-4xl translate-x-px group-hover:text-5xl group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
        <div className="grid place-items-center h-2/3">
          <div className="text-2xl text-slate-500 capitalize group-hover:text-slate-600 transition">
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
}
