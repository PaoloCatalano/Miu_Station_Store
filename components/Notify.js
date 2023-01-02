import { useEffect, useState } from "react";
import { useCtx } from "store/globalState";
import Loading from "./Loading";
import Toast from "./Toast";

const Notify = () => {
  const { notify, notifyStatus } = useCtx();

  /** @TODO real Loading status (dura solo 3 secondi cosi...)  */
  const [message, setMessage] = useState(notifyStatus);
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    setMessage(notifyStatus);
    setNewMessage(false);

    const hideToast = setTimeout(() => {
      notify({});
    }, 3000);

    if (
      Object.keys(notifyStatus).length !== 0 &&
      JSON.stringify(Object.keys(message)) ===
        JSON.stringify(Object.keys(notifyStatus))
    ) {
      notify({});
      clearTimeout(hideToast);
      setNewMessage(true);
    }

    return () => clearTimeout(hideToast);
  }, [notifyStatus]);

  useEffect(() => {
    if (newMessage) notify(message);
  }, [newMessage]);

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
