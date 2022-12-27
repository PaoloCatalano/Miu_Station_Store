import { useEffect } from "react";
import { useCtx } from "store/globalState";
import Loading from "./Loading";
import Toast from "./Toast";

const Notify = () => {
  const { notify, notifyStatus } = useCtx();

  /** @TODO real Loading status (dura solo 3 secondi cosi...)  */

  useEffect(() => {
    const hideToast = setTimeout(() => {
      notify({});
    }, 3000);

    return () => clearTimeout(hideToast);
  }, [notifyStatus]);

  return (
    <>
      {notifyStatus.loading && <Loading />}
      {notifyStatus.error && (
        <Toast
          msg={{ msg: notifyStatus.error, title: "Error" }}
          handleShow={() => notify({})}
          bgColor="bg-red-400"
        />
      )}

      {notifyStatus.info && (
        <Toast
          msg={{ msg: notifyStatus.info, title: "Info" }}
          handleShow={() => notify({})}
          bgColor="bg-yellow-400"
        />
      )}

      {notifyStatus.success && (
        <Toast
          msg={{ msg: notifyStatus.success, title: "Success" }}
          handleShow={() => notify({})}
          bgColor="bg-green-300"
        />
      )}
    </>
  );
};

export default Notify;
