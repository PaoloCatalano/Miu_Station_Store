import Link from "next/link";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";

export default function Links({ click, url, title }) {
  const router = useRouter();

  const { isMenuOpen } = useCtx();
  return (
    <li className="">
      <Link href={url} onClick={() => isMenuOpen(false)}>
        <span
          className={`${
            url === router.pathname
              ? "before:block before:absolute before:-inset-1 before:-z-10 before:-skew-y-3 before:bg-slate-300 before:animate-boeing-once relative inline-block"
              : "text-slate-500  hover:text-slate-700 "
          } capitalize `}
        >
          {title}
        </span>
      </Link>
    </li>
  );
}
