import Link from "next/link";
import Social from "./Social";

export default function Footer() {
  return (
    <footer className="flex flex-col h-auto w-full p-4 space-y-4 items-center justify-center text-center border-t md:flex-row-reverse md:justify-between">
      <div>
        <Social />
      </div>
      <Link href="/contact">More Contacts</Link>
      <div>LOGO &copy; {new Date().getFullYear()} MiuStationStore</div>
    </footer>
  );
}
