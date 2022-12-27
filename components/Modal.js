import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import { ACTIONS } from "store/actions";

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
        // router.reload();
      }
    }
  };

  return (
    <div
      className={`${
        modal.length !== 0 ? "grid" : "hidden"
      } fixed inset-0  place-items-center z-30 overflow-x-hidden w-full h-full bg-slate-500/80 outline-none transition`}
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className={`${
          modal.length !== 0 ? "cssAnimationFalling" : ""
        }  relative  w-auto -translate-y-3/4 pointer-events-none transition-all`}
        role="document"
      >
        <div className="relative flex flex-col w-100 pointer-events-auto bg-white bg-clip-padding rounded border border-sky-500 shadow-md outline-0">
          <div className="flex items-start justify-between p-1 border-b border-b-sky-200 rounded">
            <h5 className="mb-0 capitalize" id="exampleModalLabel">
              {modal.length !== 0 && modal[0].title}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
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
          <div className="flex flex-wrap items-center justify-end p-3 space-x-4 border-t border-t-sky-200 rounded">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-dismiss="modal"
              onClick={handleSubmit}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => closeModal()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
