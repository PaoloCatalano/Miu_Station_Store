import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import GoBack from "components/GoBack";
import OrderDetail from "components/OrderDetail";
import PleaseSign from "components/PleaseSign";
import NoProduct from "components/NoProduct";
import Title from "components/Title";

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
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Order Detail`}
        description={`Summary of my order in Miu Station`}
        canonical={`https://miustation.netlify.app/order/${orderDetail[0]._id}`}
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | Order Detail`,
          description: `Summary of my order in Miu Station`,
          url: `${
            "https://miustation.netlify.app/order/" + orderDetail[0]._id
          }`,
        }}
      />
      <Title>Order Detail</Title>
      <OrderDetail orderDetail={orderDetail} />

      <GoBack />
    </>
  );
};

export default DetailOrder;
