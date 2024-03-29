import Link from "next/link";
import { Cart } from "utils/types";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";

export default function Links({
  icon,
  url,
  title,
}: {
  icon: JSX.Element;
  url: string;
  title: string;
}) {
  const router = useRouter();

  const { isMenuOpen, cart }: { isMenuOpen: Function; cart: Cart[] } = useCtx();

  const calcTotItems = cart.reduce((acc: number, item) => {
    return acc + item.quantity;
  }, 0);

  return (
    <li className="my-0 mx-4 text-2xl md:text-base">
      <Link
        className="group flex relative items-baseline space-x-2"
        href={url}
        onClick={() => isMenuOpen(false)}
      >
        <span
          className={` ${
            url === router.pathname ? "text-sky-700" : "text-sky-500"
          } group-hover:text-sky-700 transition`}
        >
          {icon}
        </span>
        <div
          className={`${
            url === router.pathname
              ? "before:block before:absolute before:-inset-1 before:-z-10 before:-skew-y-3 before:bg-blue-200 text-sky-700 before:animate-boeing-once relative inline-block"
              : "text-sky-500  group-hover:text-sky-700 "
          } capitalize transition`}
        >
          {title}
        </div>
        {title === "cart" && cart.length > 0 && (
          <span className="bg-miu-500/80 text-sky-50 rounded-full text-xs text-center h-[19px] w-[19px] pt-[1px] absolute -top-3 left-1">
            {calcTotItems}
          </span>
        )}
      </Link>
    </li>
  );
}
