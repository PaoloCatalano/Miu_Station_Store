import { useRouter } from "next/router";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

export default function GoBack() {
  const router = useRouter();

  return (
    <div className="w-full my-4 flex flex-start">
      <button
        className="text-3xl text-slate-700 hover:text-slate-600 transition"
        onClick={() => router.back()}
      >
        <BsFillArrowLeftSquareFill />{" "}
      </button>
    </div>
  );
}
