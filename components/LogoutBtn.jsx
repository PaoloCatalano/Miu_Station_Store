import { useRouter } from "next/router";
import Cookie from "js-cookie";
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
  return <Button onClick={handleLogout}>Logout</Button>;
}
