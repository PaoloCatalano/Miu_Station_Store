import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.facebook.com/profile.php?id=100080154698164"
      >
        <div>
          <FaFacebookSquare className="text-4xl text-blue-600" />
        </div>
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.instagram.com/miu_nyamaid/"
        className="ml-4"
      >
        <div>
          <FaInstagramSquare className="text-4xl text-rose-500" />
        </div>
      </Link>
    </div>
  );
}
