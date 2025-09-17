import Social from "./Social";

export default function Footer() {
  return (
    <div className="w-screen md:bg-gradient-to-b md:from-transparent  md:to-slate-50 ">
      <footer className="flex flex-col h-auto w-full p-4 space-y-4 items-center justify-center text-center md:flex-row-reverse md:justify-between md:max-w-screen-2xl mx-auto">
        <div className="mb-5 md:mb-0 md:w-[191px] md:flex md:justify-end">
          <Social />
        </div>
        <div className="text-sky-700 !mt-7">
          MiuStation&copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
