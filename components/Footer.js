import Link from "next/link";
import { useCtx } from "store/globalState";
import Social from "./Social";
import LogoutBtn from "./LogoutBtn";

export default function Footer() {
  const { auth } = useCtx();

  return (
    <div className=" md:bg-gradient-to-b md:from-transparent  md:to-slate-50 w-screen">
      <footer className="flex flex-col h-auto w-full p-4 space-y-4 items-center justify-center text-center md:flex-row-reverse md:justify-between">
        <div className="md:w-[191px] md:flex md:justify-end">
          <Social />
        </div>
        {auth.user ? (
          <LogoutBtn />
        ) : (
          <Link
            href="/login"
            className="ring-2 ring-slate-600 rounded p-2 text-slate-600 transition hover:ring-4"
          >
            Login
          </Link>
        )}
        <div className="text-slate">
          MiuStationStore&copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
