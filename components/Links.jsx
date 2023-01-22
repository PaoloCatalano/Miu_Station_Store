import Link from "next/link";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";

export default function Links({ icon, url, title }) {
  const router = useRouter();

  const { isMenuOpen, cart } = useCtx();

  const calcTotItems = cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  return (
    <li className="my-0 mx-4 text-2xl md:text-base">
      <Link
        className="flex relative items-baseline space-x-2 "
        href={url}
        onClick={() => isMenuOpen(false)}
      >
        <span className="">{icon}</span>
        <div
          className={`${
            url === router.pathname
              ? "before:block before:absolute before:-inset-1 before:-z-10 before:-skew-y-3 before:bg-slate-300 before:animate-boeing-once relative inline-block"
              : "text-slate-500  hover:text-slate-700 "
          } capitalize `}
        >
          {title}
        </div>
        {title === "cart" && cart.length > 0 && (
          <span className="bg-slate-600/80 text-slate-50 rounded-full text-xs text-center h-[19px] w-[19px] pt-[1px] absolute -top-3 left-1">
            {calcTotItems}
          </span>
        )}
      </Link>
    </li>
  );
}
