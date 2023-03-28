import Link from "next/link";
import Image from "next/image";
// import StripeBtn from "./StripeBtn";
import { patchData } from "utils/fetchData";
import { useCtx } from "store/globalState";
import Button from "./Button";
import Fieldset from "./Fieldset";

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
        <section key={order._id} className="flex flex-col break-all mx-4">
          <article className="text-left">
            <div className="font-bold">ID </div>
            <div className="text-slate-600">{order._id}</div>

            <div className="mt-4">
              <div className="font-bold">Shipping Details</div>
              <div className="text-slate-600">
                <span className="text-slate-400 smallcaps text-sm mr-1">
                  Name:
                </span>
                {order.user ? order.user.name : "USER DELETED"}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400 smallcaps text-sm mr-1">
                  Email:
                </span>
                {order.user ? order.user.email : "USER DELETED"}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400 smallcaps text-sm mr-1">
                  Address:
                </span>
                {order.address}
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400 smallcaps text-sm mr-1">
                  Mobile:
                </span>
                {order.mobile}
              </div>

              <div className="mt-4">
                <div className="font-bold">Status</div>

                {order.delivered ? (
                  <div className="text-slate-600">
                    <span className="text-slate-400 smallcaps text-sm mr-1">
                      Delivered on:
                    </span>

                    {new Date(order.updatedAt).toLocaleString()}
                  </div>
                ) : (
                  <div>
                    <span className="text-red-400 smallcaps text-sm mr-1">
                      Not Delivered
                    </span>
                  </div>
                )}
                {auth.user.role === "admin" && !order.delivered && (
                  <Button onPress={() => handleDelivered(order)}>
                    Mark as delivered
                  </Button>
                )}
              </div>

              <div className="mt-4">
                <div className="font-bold">Payment</div>

                {order.method && (
                  <div className="text-slate-600">
                    <span className="text-slate-400 smallcaps text-sm mr-1">
                      Method:
                    </span>
                    {order.method}
                  </div>
                )}

                {order.paymentId && (
                  <div className="text-slate-600">
                    <span className="text-slate-400 smallcaps text-sm mr-1">
                      Payment Id:
                    </span>
                    {order.paymentId}
                  </div>
                )}

                {order.paid ? (
                  <div className="text-slate-600">
                    <span className="text-slate-400 smallcaps text-sm mr-1">
                      Paid on:
                    </span>
                    {new Date(order.dateOfPayment).toLocaleString()}
                  </div>
                ) : (
                  <div>
                    <span className="text-red-400 smallcaps text-sm mr-1">
                      Not Paid
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <div className="font-bold">Products you ordered</div>
                {order.cart.map((item) => (
                  <div
                    className="flex flex-nowrap items-center justify-between gap-4 mb-4"
                    key={item._id}
                  >
                    <Link
                      href={`/product/${item._id}`}
                      className="overflow-hidden"
                    >
                      <Image
                        src={item.images[0].url}
                        alt={item.images[0].url}
                        width={100}
                        height={100}
                        className="rounded mt-3"
                      />
                    </Link>

                    <div className="w-full">
                      <div className="capitalize font-bold text-slate-700">
                        {item.title}
                      </div>

                      <div className="text-slate-600">
                        <span className="text-slate-400 smallcaps text-sm mr-1">
                          {item.quantity} x €{item.price} =
                        </span>
                        €{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {!order.paid && auth.user.role !== "admin" && (
            <article className="my-10">
              <Fieldset legend="Finalize my purchase">
                <div className="mb-4 smallcaps text-slate-400 ">
                  Total:
                  <span className="ml-1 text-xl font-bold text-slate-600">
                    €{order.total}
                  </span>
                </div>
                {/* <StripeBtn order={order} /> */}
                <Button hipster>
                  {" "}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`mailto:${
                      process.env.ADMIN_EMAIL
                    }?subject=Shop bag of ${
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
                </Button>
              </Fieldset>
            </article>
          )}
        </section>
      ))}
    </>
  );
};

export default OrderDetail;
