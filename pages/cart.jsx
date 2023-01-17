import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { getData, postData } from "utils/fetchData";
import CartItem from "components/CartItem";
import GoBack from "components/GoBack";
import Button from "components/Button";
import Input from "components/Input";
import Fieldset from "components/Fieldset";
import {
  cartSchema,
  positiveNumberSchema,
  mobileSchema,
  addressSchema,
} from "validators/valid";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { useZorm } from "react-zorm";

const FormSchema = z.object({
  address: addressSchema,
  mobile: mobileSchema,
});

const Cart = () => {
  const { cart, auth, orders, addCart, addOrder, addModal, notify } = useCtx();

  const [total, setTotal] = useState(0);

  const [errorMsg, setErrorMsg] = useState(null);

  const [callback, setCallback] = useState(false);
  const router = useRouter();

  const zo = useZorm("proceed payment", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      // const {address,mobile} = e.data
      handlePayment(e.data);
    },
  });
  const disabled = zo.validation?.success === false;

  useEffect(() => {
    const getTotal = () => {
      const result = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      const validNumber = positiveNumberSchema.safeParse(result);

      if (validNumber.error) {
        setErrorMsg(
          Object.values(fromZodError(validNumber.error))[0][0].message
        );
      } else {
        setErrorMsg(null);
      }

      //alternative code for catching error
      // try {
      //   positiveNumberSchema.parse(result);
      //   setErrorMsg(null);
      // } catch (error) {
      //   setErrorMsg(
      //     "" + fromZodError(positiveNumberSchema.safeParse(result).error)
      //   );
      // }

      setTotal(result);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("_cart_"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];

      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);

          if (res.err) {
            return notify({ error: res.err });
          }

          const { _id, title, images, price, inStock, sold } = res.product;

          const validCart = cartSchema.safeParse({
            _id,
            inStock,
            sold,
            quantity: item.quantity,
          });

          if (validCart.error) {
            setErrorMsg(
              Object.values(fromZodError(validCart.error))[0][0].message
            );
          } else {
            setErrorMsg(null);
          }

          if (res.product && inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }

        addCart(newArr);
      };

      updateCart();
    }
  }, [callback]);

  const handlePayment = async ({ address, mobile }) => {
    // if (!address || !mobile || !isNumb)
    //   return notify({ error: "Please add your address and mobile number." });

    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return notify({
        error: "Product is out of stock or quantity insufficient.",
      });
    }

    notify({ loading: true });

    postData("order", { address, mobile, cart, total }, auth.token).then(
      (res) => {
        if (res.err) return notify({ error: res.err });

        addCart([]);

        const newOrder = {
          ...res.newOrder,
          user: auth.user,
        };
        addOrder([...orders, newOrder]);
        notify({ success: res.msg });
        return router.push(`/order/${res.newOrder._id}`);
      }
    );
  };

  if (cart.length === 0)
    return (
      <div className="row mx-auto">
        <div className="col-md-8 text-secondary table-responsive my-5">
          <h2 className="text-uppercase">The Cart is empty</h2>
        </div>
        <Link href="/">
          <button
            type="button"
            className="btn btn-warning w-100 text-uppercase"
          >
            enjoy shopping
          </button>
        </Link>
      </div>
    );
  /**@TODO change vercel */
  return (
    <div className="row mx-auto">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Cart`}
        canonical="https://miu-shop.vercel.app/cart"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} | Cart`,
          url: "https://miu-shop.vercel.app/cart",
        }}
      />

      <div className="col-md-8 text-secondary table-responsive my-3">
        <h2 className="text-uppercase">Shopping Cart</h2>

        <table className="table my-3">
          <tbody>
            {cart.map((item) => (
              <CartItem key={item._id} item={item} cart={cart} />
            ))}
          </tbody>
        </table>
        <hr />
        <button
          className="btn btn-outline-danger ml-2 mb-4"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() =>
            addModal([
              {
                data: "",
                id: "",
                title: "Empty the Cart?",
                type: "emptyCart",
              },
            ])
          }
        >
          DELETE ALL
        </button>
      </div>
      <div className="col-md-4 my-3 text-right text-uppercase text-secondary">
        <form ref={zo.ref}>
          <Fieldset legend="Shipping Details">
            {auth.user && (
              <Input
                label="Address"
                type="text"
                name={zo.fields.address()}
                id={zo.fields.address("id")}
                errorMessage={zo.errors.address((e) => e.message)}
                defaultValue={auth?.user?.address}
              />
            )}
            {auth.user && (
              <Input
                label="Mobile"
                type="text"
                id={zo.fields.mobile("id")}
                maxLength={15}
                name={zo.fields.mobile()}
                errorMessage={zo.errors.mobile((e) => e.message)}
                defaultValue={auth?.user?.mobile}
              />
            )}
            <h2>
              Total: <span className="text-danger">${total}</span>
            </h2>
            {errorMsg && <p className="text-red-400">{errorMsg}</p>}
            {auth?.user ? (
              <Button
                isDisabled={disabled || errorMsg ? true : false}
                type="submit"
                className="btn btn-dark my-2"
                onClick={handlePayment}
              >
                Proceed with payment
              </Button>
            ) : (
              <Link href={auth.user ? "#!" : "/login"}>
                <Button>Login to proceed with the payment</Button>
              </Link>
            )}
          </Fieldset>
        </form>
      </div>
      <GoBack />
    </div>
  );
};

export default Cart;
