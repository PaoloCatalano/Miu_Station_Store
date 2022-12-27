import Link from "next/link";
import Links from "./Links";
import { useCtx } from "store/globalState";
import Button from "./Button";

export default function Navbar() {
  const { open, isMenuOpen, auth } = useCtx();

  return (
    <nav className="z-10 w-screen relative">
      <button
        aria-pressed={open}
        className="rotate-[var(--rotate,_0)] fixed z-20 top-0 right-0 bg-teal-500/30 backdrop-blur rounded-lg m-2 outline-0 transition h-min md:hidden py-2 px-3 select-none"
        onClick={() => isMenuOpen(!open)}
      >
        &#9776;
      </button>
      <div
        aria-expanded={open}
        className="fixed -top-[var(--aside-height)] w-full right-0 transition translate-y-[calc(var(--open,_0)_*_var(--aside-height))] shadow-lg md:sticky md:translate-y-0 md:top-0"
      >
        <ul className="flex flex-col items-baseline space-x-3 space-y-5 bg-gradient-to-tr from-teal-500/30 to-teal-500/100 backdrop-blur-xl h-[var(--aside-height)] p-4 pt-6  md:flex-row md:h-auto ">
          <div className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start">
            {process.env.WEBSITE_NAME}
          </div>
          {links.map((link) => (
            <Links key={link.url} {...link} />
          ))}
          {Object.keys(auth).length !== 0 ? (
            <Link href="/profile">
              <Button>Profile</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}

const links = [
  {
    url: "/products",
    title: "products",
  },
  {
    url: "/cart",
    title: "cart",
  },
  {
    url: "/categories",
    title: "categories",
  },
  {
    url: "/sales",
    title: "on sale",
  },
  {
    url: "/about",
    title: "about",
  },
  {
    url: "/contact",
    title: "contact",
  },
];
