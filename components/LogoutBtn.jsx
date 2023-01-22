import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { TbLogout } from "react-icons/tb";
import { useCtx } from "store/globalState";
import Button from "./Button";

export default function LogoutBtn() {
  const { notify, authUser } = useCtx();
  const router = useRouter();
  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    authUser({});
    notify({ success: "Logged out!" });
    return router.push("/");
  };
  return (
    <div className="relative">
      <span className="absolute text-slate-500 text-3xl top-1 -left-9">
        <TbLogout />
      </span>
      <Button onClick={handleLogout} hipster>
        Logout
      </Button>
    </div>
  );
}
