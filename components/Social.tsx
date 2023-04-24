import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.facebook.com/profile.php?id=100080154698164"
        aria-label="facebook profile"
      >
        <div>
          <FaFacebookSquare className="text-4xl bg-slate-50/80 rounded text-blue-600 hover:text-blue-700 transition" />
        </div>
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.instagram.com/miu_nyamaid/"
        className="ml-4"
        aria-label="instagram miu nyamaid"
      >
        <div>
          <FaInstagramSquare className="text-4xl bg-slate-50/80 rounded text-rose-500 hover:text-rose-600 transition" />
        </div>
      </Link>
    </div>
  );
}
