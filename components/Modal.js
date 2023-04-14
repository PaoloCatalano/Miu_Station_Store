import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import { ACTIONS } from "store/actions";
import Button from "components/Button";

const Modal = () => {
  const {
    modal,
    closeModal,
    deleteCart,
    deleteCategories,
    deleteProduct,
    deleteUser,
    emptyCart,
  } = useCtx();

  const router = useRouter();

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === ACTIONS.ADD_CART) deleteCart(item);

        if (item.type === ACTIONS.ADD_USER) deleteUser(item);

        if (item.type === ACTIONS.ADD_CATEGORY) deleteCategories(item);

        if (item.type === "deleteProduct") deleteProduct(item);

        if (item.type === "emptyCart") emptyCart();

        closeModal();

        if (router.pathname === "/products") {
          setTimeout(() => {
            router.reload();
          }, 3000);
        }
      }
    }
  };

  return (
    <div
      className={`${
        modal.length !== 0 ? "grid" : "hidden"
      } fixed inset-0  place-items-center z-30 overflow-x-hidden w-full h-full bg-slate-500/80 outline-none transition`}
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div
        className={`${
          modal.length !== 0 ? "cssAnimationFalling" : ""
        }  relative  w-auto -translate-y-3/4 pointer-events-none transition-all`}
        role="document"
      >
        <div className="relative max-w-screen-md flex flex-col w-100 pointer-events-auto bg-white bg-clip-padding break-all rounded border-2 border-slate-200 shadow-md outline-0">
          <div className="flex justify-end pt-1 pr-2">
            <button
              type="button"
              aria-label="Close"
              onClick={() => closeModal()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="relative flex-auto p-4">
            Are you sure to{" "}
            <span className="text-red-500 font-bold">Delete</span>?
          </div>
          <div className="p-2 text-center capitalize">
            {modal.length !== 0 && modal[0].title}
          </div>
          <div className="flex flex-wrap items-center justify-end p-3 space-x-4 border-t border-t-slate-200">
            <button
              type="button"
              className="underline underline-offset-4 text-red-500 decoration-2 hover:text-red-700 transition"
              onClick={handleSubmit}
            >
              Yes, Delete!
            </button>
            <Button onPress={() => closeModal()}>Exit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
