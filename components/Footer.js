import Link from "next/link";
import { useCtx } from "store/globalState";
import Social from "./Social";
import LogoutBtn from "./LogoutBtn";

export default function Footer() {
  const { auth } = useCtx();

  return (
    <>
      {auth.user && <LogoutBtn />}
      <footer className="flex flex-col h-auto w-full p-4 space-y-4 items-center justify-center text-center md:flex-row-reverse md:justify-between">
        <div>
          <Social />
        </div>
        <Link href="/contact">Contacts</Link>
        <div>LOGO &copy; {new Date().getFullYear()} MiuStationStore</div>
      </footer>
    </>
  );
}
