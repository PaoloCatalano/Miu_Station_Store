import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { TbLogout } from "react-icons/tb";
import { useCtx } from "store/globalState";
import Button from "./Button";

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
  return (
    <div className="w-full md:w-fit flex justify-end ">
      <button
        className="text-slate-500 relative mr-5 hover:text-slate-700 text-sm"
        onClick={handleLogout}
        aria-label="Logout"
      >
        <span className="absolute pointer-events-none text-slate-500 text-xl -left-6">
          <TbLogout />
        </span>
        Logout
      </button>
    </div>
  );
}
