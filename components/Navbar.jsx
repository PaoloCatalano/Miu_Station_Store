import Link from "next/link";
import Links from "./Links";
import { useCtx } from "store/globalState";
import Button from "./Button";
import Hamburger from "./Hamburger";

export default function Navbar() {
  const { open, isMenuOpen, auth } = useCtx();

  return (
    <nav className="z-10 w-screen relative">
      {/* <button
        aria-pressed={open}
        className="rotate-[var(--rotate,_0)] fixed z-20 top-0 right-0 bg-slate-500/30 backdrop-blur rounded-lg m-2 outline-0 transition h-min md:hidden py-2 px-3 select-none"
        onClick={() => isMenuOpen(!open)}
      >
        &#9776;
      </button> */}
      <div onClick={() => isMenuOpen(!open)}>
        <Hamburger open={open} />
      </div>
      <div
        aria-expanded={open}
        className="fixed -top-[var(--nav-height)] w-full right-0 duration-500 ease-[cubic-bezier(1,1.6,.31,.69)] translate-y-[calc(var(--open,_0)_*_var(--nav-height))]  md:sticky md:translate-y-0 md:top-0"
      >
        <ul className="flex flex-col items-baseline space-x-3 space-y-5 bg-gradient-to-tr from-slate-500/30 to-slate-500/100 backdrop-blur-xl h-[var(--nav-height)] p-4 pt-6 border-b-2 border-slate-500 md:flex-row md:h-auto md:from-slate-100 md:to-slate-50">
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
