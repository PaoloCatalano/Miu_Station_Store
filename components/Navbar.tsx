import { HTMLAttributes, DetailedHTMLProps } from "react";
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
import LogoutBtn from "./LogoutBtn";
import logo from "public/images/logos/icon.png";

type ExtendedDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  onClick: () => void;
};

export default function Navbar() {
  const { open, isMenuOpen, auth } = useCtx();

  const divProps: ExtendedDivProps = {
    onClick: () => isMenuOpen(!open),
  };

  return (
    <nav className="relative w-screen flex justify-center z-20 bg-gradient-to-t from-blue-100  via-white to-slate-50 border-b-2 border-slate-200">
      <div
        className={`${
          open ? "static h-0" : "fixed h-14"
        } w-screen  z-0 bg-gradient-to-b from-blue-100 to-slate-50 md:hidden`}
      >
        <div className="absolute top-2 left-0 text-center w-full md:static md:grow md:w-fit md:text-start">
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
      <div {...divProps}>
        <Hamburger open={open} />
      </div>
      <div
        aria-haspopup={open}
        className={`${
          open ? "translate-y-[var(--nav-height)]" : "translate-y-0"
        } fixed -top-[var(--nav-height)] w-full right-0 duration-500 ease-[cubic-bezier(1,1.6,.31,.69)] md: max-w-screen-2xl md:sticky md:translate-y-0 md:top-0`}
      >
        <ul className="flex flex-col items-center justify-evenly   bg-gradient-to-t from-blue-100  via-white to-slate-50 backdrop-blur-2xl h-[var(--nav-height)] p-6 pb-16 md:pb-6 border-b-2 border-slate-200 md:border-b-0 md:flex-row md:h-auto md:items-baseline md:space-x-5">
          <li className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start">
            <div className="relative">
              <Link
                href="/"
                className="z-20 absolute top-0 left-3 md:-top-8 md:-left-2"
                onClick={() => isMenuOpen(false)}
              >
                <Image
                  src={logo}
                  alt="miu"
                  placeholder="blur"
                  className="w-14 rounded-full "
                  sizes="50vw"
                />
              </Link>
              {auth.user ? (
                <div className="flex flex-row flex-nowrap justify-center text-sm  pl-14 translate-y-4 md:absolute md:-translate-y-[14px] md:pl-24">
                  <LogoutBtn />
                </div>
              ) : (
                <div className="block text-sm pl-4 translate-y-4 text-miu-500 transition hover:text-miu-600 md:absolute md:pl-16 md:-translate-y-4">
                  <Link href="/login" onClick={() => isMenuOpen(false)}>
                    Login {/* / Register */}
                  </Link>
                </div>
              )}
            </div>
          </li>
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
  // {
  //   url: "/sales",
  //   title: "sales",
  //   icon: <TbDiscount2 />,
  // },
  // {
  //   url: "/cart",
  //   title: "cart",
  //   icon: <TiShoppingCart />,
  // },
  {
    url: "/profile",
    title: "admin",
    icon: <CgProfile />,
  },
];
