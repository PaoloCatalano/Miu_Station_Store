import Navbar from "./Navbar";
import Notify from "./Notify";
import Modal from "./Modal";
import Footer from "./Footer";
import Loading from "./Loading";
import { useCtx } from "store/globalState";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useCtx();

  return (
    <>
      {loading && <Loading simple />}
      <div className="container flex min-h-screen flex-col items-center justify-center ">
        <Notify />
        <Navbar />
        <Modal />
        <main className="flex w-screen flex-1 flex-col items-center justify-start px-1 text-center grow pt-24 md:pt-[10vh]">
          {/* px-16 */}

          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
