import { useReducer, useContext, createContext, useEffect } from "react";
import Router from "next/router";
import reducers from "./reducers";
import { ACTIONS } from "./actions";
import { getData, deleteData } from "utils/fetchData";

//create the context
const AppContext = createContext();

const initialState = {
  open: false,
  notifyStatus: {},
  auth: {},
  cart: [],
  modal: [],
  orders: [],
  users: [],
  categories: [],
  loading: false,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth, loading } = state;

  //dispatch all actions
  function isMenuOpen(isOpen) {
    dispatch({
      type: ACTIONS.OPEN_MENU,
      payload: isOpen,
    });
  }

  function isLoading(isLoading) {
    dispatch({
      type: ACTIONS.LOADING,
      payload: isLoading,
    });
  }

  function authUser(objUser) {
    dispatch({
      type: ACTIONS.AUTH,
      payload: objUser,
    });
  }

  function notify(objMsg /* OBJECT {error, success or info} */) {
    dispatch({ type: ACTIONS.NOTIFY, payload: objMsg });
  }

  function addCategory(arrCategory) {
    dispatch({
      type: ACTIONS.ADD_CATEGORY,
      payload: arrCategory,
    });
  }

  function addCart(arrCart) {
    dispatch({ type: ACTIONS.ADD_CART, payload: arrCart });
  }

  function addOrder(arrOrders) {
    dispatch({ type: ACTIONS.ADD_ORDER, payload: arrOrders });
  }
  function addUser(arrUsers) {
    dispatch({ type: ACTIONS.ADD_USER, payload: arrUsers });
  }
  function addModal(arrOfObj) {
    dispatch({ type: ACTIONS.ADD_MODAL, payload: arrOfObj });
  }

  function closeModal() {
    dispatch({ type: ACTIONS.ADD_MODAL, payload: [] });
  }

  //additional functions
  function addToCart(product, cart) {
    if (product.inStock <= 0) {
      notify({ error: "This product is out of stock." });
      return;
    }

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (!check) {
      notify({ info: "The product is already in your cart." });
      return;
    }

    addCart([...cart, { ...product, quantity: 1 }]);
    notify({ success: "Added to Cart" });
  }

  function decrease(cart, id) {
    const newCart = [...cart];
    newCart.forEach((item) => {
      if (item._id === id) item.quantity -= 1;
    });

    addCart(newCart);
  }

  function increase(cart, id) {
    const newCart = [...cart];
    newCart.forEach((item) => {
      if (item._id === id) item.quantity += 1;
    });

    addCart(newCart);
  }

  function deleteItem(data, id, type) {
    const newData = data.filter((item) => item._id !== id);
    dispatch({ type, payload: newData });
  }

  function updateItem(data, id, post, type) {
    const newData = data.map((item) => (item._id === id ? post : item));
    dispatch({ type, payload: newData });
  }

  // Modal functions
  function emptyCart() {
    dispatch({ type: ACTIONS.EMPTY_CART, payload: [] });
  }

  function deleteCart(item) {
    deleteItem(item.data, item.id, item.type);
  }

  function deleteProduct(item) {
    notify({ loading: true });
    deleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err) return notify({ error: res.err });
      return notify({ info: res.msg });
    });
  }

  function deleteCategories(item) {
    notify({ loading: true });
    deleteData(`categories/${item.id}`, auth.token).then((res) => {
      if (res.err) return notify({ error: res.err });

      deleteItem(item.data, item.id, item.type);
      return notify({ success: res.msg });
    });
  }

  const deleteUser = (item) => {
    deleteItem(item.data, item.id, item.type);

    deleteData(`user/${item.id}`, auth.token).then((res) => {
      if (res.err) return notify({ error: res.err });
      return notify({ success: res.msg });
    });
  };

  //useEffects at first render

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.err) return localStorage.removeItem("firstLogin");
        authUser({ token: res.access_token, user: res.user });
      });
    }

    getData("categories").then((res) => {
      if (res.err) return notify({ error: res.err });

      return addCategory(res.categories);
    });
  }, []);

  useEffect(() => {
    const _cart_ = JSON.parse(localStorage.getItem("_cart_"));

    if (_cart_) {
      addCart(_cart_);
    }
  }, []);

  //useEffects on first render and depending on variables
  useEffect(() => {
    localStorage.setItem("_cart_", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.err) return notify({ error: res.err });

        addOrder(res.orders);
      });

      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.err) return notify({ error: res.err });

          addUser(res.users);
        });
      }
    } else {
      addOrder([]);
      addUser([]);
    }
  }, [auth.token]);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      // console.log(url);
      isLoading(true);
      console.log("start changing");
    });

    Router.events.on("routeChangeComplete", (url) => {
      isLoading(false);
      // console.log("route changing finished");
    });

    Router.events.on("routeChangeError", (url) => {
      isLoading(false);
      // console.log("route error");
    });
  }, [Router]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        isMenuOpen,
        authUser,
        notify,
        addCart,
        addCategory,
        addOrder,
        addUser,
        addModal,
        closeModal,
        addToCart,
        decrease,
        increase,
        deleteItem,
        updateItem,
        emptyCart,
        deleteProduct,
        deleteCategories,
        deleteUser,
        deleteCart,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useCtx = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useCtx };

/** @TODO wishlist functionality  */
/** @TODO inStock = 0 bug  */
/**@TODO removed w-[247.2px] */
