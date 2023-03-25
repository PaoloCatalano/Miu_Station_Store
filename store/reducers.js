import { ACTIONS } from "./actions";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.OPEN_MENU:
      return {
        ...state,
        open: action.payload,
      };
    case ACTIONS.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.NOTIFY:
      return {
        ...state,
        notifyStatus: action.payload,
      };
    case ACTIONS.AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case ACTIONS.ADD_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case ACTIONS.ADD_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: action.payload,
      };
    case ACTIONS.ADD_USER:
      return {
        ...state,
        users: action.payload,
      };
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: action.payload,
      };
    case ACTIONS.EMPTY_CART:
      return {
        ...state,
        cart: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
