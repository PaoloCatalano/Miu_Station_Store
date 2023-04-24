import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useRouter } from "next/router";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

type ExtendedButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  onClick: () => void;
};

export default function GoBack() {
  const router = useRouter();

  const buttonProps: ExtendedButtonProps = {
    onClick: () => router.back(),
  };

  return (
    <div className="w-11/12 max-w-screen-2xl">
      <div className="w-full my-4 flex flex-start">
        <button
          className="text-3xl text-slate-700 hover:text-slate-600 transition"
          aria-label="go back to previous page"
          {...buttonProps}
        >
          <BsFillArrowLeftSquareFill />{" "}
        </button>
      </div>
    </div>
  );
}
