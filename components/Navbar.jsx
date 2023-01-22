import Link from "next/link";
import { GiShirtButton } from "react-icons/gi";
import { AiFillTags } from "react-icons/ai";
import { TbDiscount2, TbUsers } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { BsFillBagPlusFill } from "react-icons/bs";
import Links from "./Links";
import { useCtx } from "store/globalState";
// import Button from "./Button";
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
      <div
        className={`${
          open ? "static h-0" : "fixed h-20"
        } w-screen  z-0 bg-slate-100 shadow-out md:hidden`}
      >
        <div className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start">
          <Link href="/">LOGO</Link>
        </div>
      </div>
      <div onClick={() => isMenuOpen(!open)}>
        <Hamburger open={open} />
      </div>
      <div
        aria-expanded={open}
        className="fixed -top-[var(--nav-height)] w-full right-0 duration-500 ease-[cubic-bezier(1,1.6,.31,.69)] translate-y-[calc(var(--open,_0)_*_var(--nav-height))]  md:sticky md:translate-y-0 md:top-0"
      >
        <ul className="flex flex-col items-center justify-evenly  bg-gradient-to-tr from-slate-200/30 to-slate-200/100 backdrop-blur-2xl h-[var(--nav-height)] p-6  border-b-2 border-slate-500 shadow-md md:flex-row md:h-auto md:items-baseline md:space-x-5 md:from-slate-100 md:to-slate-50">
          <div className="absolute top-2 left-0 text-center w-full  md:static md:grow md:w-fit md:text-start">
            <Link href="/">LOGO</Link>
          </div>
          {auth.user?.role === "admin" &&
            linksAuth.map((link) => <Links key={link.url} {...link} />)}

          {links.map((link) => (
            <Links key={link.url} {...link} />
          ))}
          {/* {Object.keys(auth).length !== 0 ? (
            <Link href="/profile">
              <Button>Profile</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )} */}
        </ul>
      </div>
    </nav>
  );
}
const linksAuth = [
  {
    url: "/create",
    title: "create",
    icon: <BsFillBagPlusFill />,
  },
  {
    url: "/users",
    title: "users",
    icon: <TbUsers />,
  },
];

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
