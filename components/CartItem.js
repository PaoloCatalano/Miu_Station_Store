import Link from "next/link";
import { useCtx } from "store/globalState";
import { ACTIONS } from "store/actions";
import Image from "next/image";
import {
  FaTrashAlt,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";

const CartItem = ({ item, cart }) => {
  const { decrease, increase, addModal } = useCtx();
  return (
    <div className="flex flex-nowrap items-center justify-between gap-1">
      <Link href={`/product/${item._id}`} className="overflow-hidden">
        <Image
          src={item.images[0].url}
          alt={item.images[0].url}
          width={100}
          height={100}
          className="rounded mt-3"
        />
      </Link>

      <div className="w-full ">
        <div className="capitalize font-bold text-slate-700">{item.title}</div>

        <div className="text-slate-600">€{item.quantity * item.price}</div>
        {item.inStock > 0 ? (
          <p className=" text-slate-500 text-xs">{item.inStock} in Stock</p>
        ) : (
          <p className=" text-red-500">Out Stock</p>
        )}
      </div>

      <div className="mt-2 mr-2">
        <button
          className="text-miu-500 disabled:text-slate-200 hover:text-miu-600 transition"
          onClick={() => increase(cart, item._id)}
          disabled={item.quantity >= item.inStock ? true : false}
        >
          <FaChevronCircleUp className=" -mb-1" />
        </button>

        <span className="px-1 text-slate-600">{item.quantity}</span>

        <button
          className="text-miu-500 disabled:text-slate-200 hover:text-miu-600 transition"
          onClick={() => decrease(cart, item._id)}
          disabled={item.quantity <= 1 ? true : false}
        >
          <FaChevronCircleDown className="-mb-1" />
        </button>
      </div>

      <div
        className="cursor-pointer text-red-500 p-1  transition hover:text-red-600"
        aria-hidden="true"
        onClick={() =>
          addModal([
            {
              data: cart,
              id: item._id,
              title: item.title,
              type: ACTIONS.ADD_CART,
            },
          ])
        }
      >
        <FaTrashAlt />
      </div>
    </div>
  );
};

export default CartItem;
