import Link from "next/link";
import { useCtx } from "store/globalState";
import Social from "./Social";
import LogoutBtn from "./LogoutBtn";

export default function Footer() {
  const { auth } = useCtx();

  return (
    <div className="w-screen md:bg-gradient-to-b md:from-transparent  md:to-slate-50 ">
      <footer className="flex flex-col h-auto w-full p-4 space-y-4 items-center justify-center text-center md:flex-row-reverse md:justify-between md:max-w-screen-2xl mx-auto">
        <div className="md:w-[191px] md:flex md:justify-end">
          <Social />
        </div>
        {auth.user ? (
          <LogoutBtn />
        ) : (
          <Link
            href="/login"
            className="my-3 px-5 ring-2 ring-slate-600 rounded p-2 text-slate-600 transition hover:ring-4"
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
