const Toast = ({ msg, handleShow, bgColor }) => {
  return (
    <div
      className={`cssAnimationJumping fixed ${bgColor} top-1 right-1 z-50 min-w-[280px] max-w-[350px] shadow rounded transition `}
    >
      <div className={`flex items-center py-1 px-3 rounded ${bgColor} `}>
        <strong className="mr-auto">{msg.title}</strong>

        <button
          type="button"
          className="ml-2 mb-1 float-right text-2xl font-bold drop-shadow opacity-50 outline-none"
          onClick={handleShow}
        >
          x
        </button>
      </div>

      <div className="p-3">{msg.msg}</div>
    </div>
  );
};
export default Toast;
