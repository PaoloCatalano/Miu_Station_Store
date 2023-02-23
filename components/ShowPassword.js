import { RiEye2Line, RiEyeCloseLine } from "react-icons/ri";

export default function ShowPassword({ setShowPassword, showPassword }) {
  return (
    <div className="flex justify-end -mt-3 mr-2 mb-3 text-sm">
      <button
        className="flex flex-nowrap items-center space-x-2 focus:outline-none"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        <span className="text-slate-500 text-xs">Show Password</span>

        {showPassword ? (
          <RiEye2Line className="text-lg text-slate-700" />
        ) : (
          <RiEyeCloseLine className="text-lg text-slate-700" />
        )}
      </button>
    </div>
  );
}
