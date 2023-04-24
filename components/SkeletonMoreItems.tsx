import { FaChevronRight } from "react-icons/fa";

export default function MoreItems() {
  return (
    <div className="relative w-60 h-60 rounded-md border-2 border-slate-200 shadow-none bg-slate-100 overflow-hidden animate-pulse">
      <div className="absolute bottom-0 bg-white border-t-2 border-slate-200 w-full h-[77px]">
        <div className="w-full">
          <div className="rounded-full grid place-items-center aspect-square w-14 bg-white border-2 border-slate-300 -translate-y-7 mx-auto shadow-sm">
            <FaChevronRight className="text-slate-300 text-4xl translate-x-px" />
          </div>
        </div>
      </div>
      <div className="grid place-items-center h-2/3"></div>
    </div>
  );
}
