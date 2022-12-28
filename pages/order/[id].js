import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import GoBack from "components/GoBack";
import OrderDetail from "components/OrderDetail";
import PleaseSign from "components/PleaseSign";
import NoProduct from "components/NoProduct";

const DetailOrder = () => {
  const { orders, auth } = useCtx();

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return <PleaseSign />;

  if (orderDetail.length === 0) return <NoProduct />;

  return (
    <div className="my-3">
      <NextSeo title={`${process.env.WEBSITE_NAME} | Order Detail`} />

      <OrderDetail orderDetail={orderDetail} />

      <GoBack />
    </div>
  );
};

export default DetailOrder;
