import Link from "next/link";
import Image from "next/image";
import { GiShirtButton } from "react-icons/gi";
import { AiFillTags } from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import Links from "./Links";
import { useCtx } from "store/globalState";
import Hamburger from "./Hamburger";
import logo from "public/images/logos/icon.png";

export default function Navbar() {
  const { open, isMenuOpen, auth } = useCtx();

  return (
    <nav className="relative w-screen flex justify-center z-20 bg-gradient-to-t from-blue-100  via-white to-slate-50   border-b-2 border-slate-200">
      {/* <button
        aria-pressed={open}
        className="rotate-[var(--rotate,_0)] fixed z-20 top-0 right-0 bg-slate-500/30 backdrop-blur rounded-lg m-2 outline-0 transition h-min md:hidden py-2 px-3 select-none"
        onClick={() => isMenuOpen(!open)}
      >
        &#9776;
      </button> */}
      <div
        className={`${
          open ? "static h-0" : "fixed h-14"
        } w-screen  z-0 bg-gradient-to-b from-blue-100 to-slate-50 md:hidden`}
      >
        <div className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start">
          <Link href="/">
            <Image
              src={logo}
              alt="miu"
              placeholder="blur"
              className="w-14 absolute top-0 left-4 rounded-full"
              sizes="50vw"
            />
          </Link>
        </div>
      </div>
      <div onClick={() => isMenuOpen(!open)}>
        <Hamburger open={open} />
      </div>
      <div
        aria-expanded={open}
        className="fixed -top-[var(--nav-height)] w-full right-0 duration-500 ease-[cubic-bezier(1,1.6,.31,.69)] translate-y-[calc(var(--open,_0)_*_var(--nav-height))] md: max-w-screen-2xl md:sticky md:translate-y-0 md:top-0"
      >
        <ul className="flex flex-col items-center justify-evenly   bg-gradient-to-t from-blue-100  via-white to-slate-50 backdrop-blur-2xl h-[var(--nav-height)] p-6  border-b-2 border-slate-200 md:border-b-0 md:flex-row md:h-auto md:items-baseline md:space-x-5">
          <div
            // onClick={() => isMenuOpen(false)}
            className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start"
          >
            <div>
              <Link href="/">
                <Image
                  src={logo}
                  alt="miu"
                  placeholder="blur"
                  className="w-14 absolute top-2 left-4 rounded-full"
                  sizes="50vw"
                />
              </Link>
              {auth.user && (
                <div className="inline capitalize text-sm text-sky-500 pl-4 md:pl-14">
                  Hi, {auth.user.name}
                  <Link href="/profile">
                    <Image
                      src={auth.user.avatar}
                      alt={auth.user.avatar}
                      width={30}
                      height={30}
                      className="ml-1 overflow-hidden aspect-square object-cover rounded-full shadow inline"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
          {links.map((link) => (
            <Links key={link.url} {...link} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

const links = [
  {
    url: "/products",
    title: "products",
    icon: <GiShirtButton />,
  },
  {
    url: "/categories",
    title: "categories",
    icon: <AiFillTags />,
  },
  {
    url: "/sales",
    title: "sales",
    icon: <TbDiscount2 />,
  },
  {
    url: "/cart",
    title: "cart",
    icon: <TiShoppingCart />,
  },
  {
    url: "/profile",
    title: "profile",
    icon: <CgProfile />,
  },
];
