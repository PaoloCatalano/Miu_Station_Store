import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { TbLogout } from "react-icons/tb";
import { useCtx } from "store/globalState";

type ExtendedButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  onClick: () => void;
};

export default function LogoutBtn() {
  const { notify, authUser, isMenuOpen } = useCtx();
  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    sessionStorage.removeItem("sessionLogin");
    authUser({});
    notify({ success: "Logged out!" });
    isMenuOpen(false);
    return router.push("/login");
  };

  const buttonProps: ExtendedButtonProps = {
    onClick: handleLogout,
  };

  return (
    <div className="w-fit md:w-fit flex justify-center ">
      <button
        className="group text-slate-500 relative mr-5 hover:text-slate-600 transition"
        aria-label="Logout"
        {...buttonProps}
      >
        <span className="absolute pointer-events-none text-slate-500 text-xl -left-6 translate-y-px group-hover:text-slate-600 transition">
          <TbLogout />
        </span>
        Logout
      </button>
    </div>
  );
}
