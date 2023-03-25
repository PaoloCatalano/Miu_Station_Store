import { useRouter } from "next/router";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

export default function GoBack() {
  const router = useRouter();

  return (
    <div className="w-11/12 max-w-screen-2xl">
      <div className="w-full my-4 flex flex-start">
        <button
          className="text-3xl text-slate-700 hover:text-slate-600 transition"
          onClick={() => router.back()}
          aria-label="go back to previous page"
        >
          <BsFillArrowLeftSquareFill />{" "}
        </button>
      </div>
    </div>
  );
}
