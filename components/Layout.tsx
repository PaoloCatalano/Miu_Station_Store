import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Notify from "./Notify";
import Modal from "./Modal";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center ">
      <Notify />
      <Navbar />
      <Modal />
      <div className="grow pt-10">{children}</div>
      <Footer />
    </div>
  );
}
