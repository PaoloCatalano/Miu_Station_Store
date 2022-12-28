import Link from "next/link";
// import PaypalBtn from "./paypalBtn";
import { patchData } from "utils/fetchData";
import { useCtx } from "store/globalState";

const OrderDetail = ({ orderDetail }) => {
  const { auth, orders, notify, updateItem } = useCtx();

  const handleDelivered = (order) => {
    notify({ loading: true });

    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err) return notify({ error: res.err });

      const { paid, dateOfPayment, method, delivered } = res.result;

      updateItem(
        orders,
        order._id,
        {
          ...order,
          paid,
          dateOfPayment,
          method,
          delivered,
        },
        "ADD_ORDERS"
      );

      return notify({ success: res.msg });
    });
  };

  if (!auth.user) return null;
  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: "20px auto" }}
          className="row justify-content-around"
        >
          <div className="uppercase my-3" style={{ maxWidth: "600px" }}>
            <h2 className="text-break">Order ID:</h2>
            <h3 className="text-primary">{order._id}</h3>

            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Address: {order.address}</p>
              <p>Mobile: {order.mobile}</p>

              <div
                className={`alert ${
                  order.delivered ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Deliverd on ${order.updatedAt}`
                  : "Not Delivered"}
                {auth.user.role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>
              <div className="mb-5"></div>
              <h3>Payment</h3>
              {order.method && (
                <h6>
                  Method: <em>{order.method}</em>
                </h6>
              )}

              {order.paymentId && (
                <p>
                  PaymentId: <em>{order.paymentId}</em>
                </p>
              )}

              <div
                className={`alert ${
                  order.paid ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid ? `Paid on ${order.dateOfPayment}` : "Not Paid"}
              </div>
              <div className="mb-5"></div>

              <div>
                <h3>Order Items</h3>
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom mx-0 p-2 justify-content-betwenn
                                    align-items-center"
                    key={item._id}
                    style={{ maxWidth: "550px" }}
                  >
                    <img
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="flex-fill text-secondary px-3 m-0">
                      <Link href={`/product/${item._id}`}>{item.title}</Link>
                    </h5>

                    <span className="text-info m-0">
                      {item.quantity} x ${item.price} = $
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4">
              <h2 className="mb-4 text-uppercase">Total: ${order.total}</h2>
              {/* <PaypalBtn order={order} /> */}
              <p>To Finalize your purchase:</p>
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-warning"
                href={`mailto:${process.env.ADMIN_EMAIL}?subject=Shop bag of ${
                  auth.user.name
                } &body=Hello,%0D%0A%0D%0AI would like to buy the following items:%0D%0A%0D%0A ${order.cart
                  .map(
                    (item) =>
                      `x${item.quantity} - ${item.title.toUpperCase()} - ${
                        item.price
                      }€ - ID:${item._id}%0D%0A%0D%0A`
                  )
                  .join("")} . %0D%0A%0D%0AThanks! %0D%0A%0D%0A Order ID: ${
                  order._id
                }`}
              >
                Contact us per email
              </a>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default OrderDetail;
