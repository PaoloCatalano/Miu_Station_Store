import Link from "next/link";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";

export default function Links({ click, url, title }) {
  const router = useRouter();

  const { isMenuOpen } = useCtx();
  return (
    <li
      className={`${
        url === router.pathname
          ? "text-white"
          : "hover:decoration-dashed hover:underline "
      } capitalize underline-offset-4`}
    >
      <Link href={url} onClick={() => isMenuOpen(false)}>
        {title}
      </Link>
    </li>
  );
}
