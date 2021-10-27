import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART,
  GET_CART_ITEMS,
  REMOVE_CART_ITEM,
  ON_SUCCESS_BUY,
} from "./types";
// import { USER_SERVER } from "../components/Config.js";

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`/api/users/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`/api/users/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`/api/users/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios.get(`/api/users/add`).then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function addToCart(id) {
  let body = {
    productId: id,
  };

  const request = axios
    .post(`/api/users/addToCart`, body)
    .then((response) => response.data);

  return {
    type: ADD_TO_CART,
    payload: request,
  };
}

export function getCartItems(cartItems, userCart) {
  const request = axios
    //products_by_id url 쓰고 쿼리만 array
    .get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then((response) => {
      //CartItem에 해당하는 정보를 가져온 후 Quantity 정보 넣어줌
      userCart.forEach((cartItem) => {
        response.data.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            response.data[index].quantity = cartItem.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: GET_CART_ITEMS,
    payload: request,
  };
}

export function removeCartItem(productId) {
  const request = axios
    .get(`${USER_SERVER}/removeFromCart?id=${productId}`)
    .then((response) => {
      //productInfo , cart 정보 조합해서 cartDetail을 만듦
      //item => cart in user, product = > product
      response.data.cart.forEach((item) => {
        response.data.productInfo.forEach((product, index) => {
          if (item.id === product._id) {
            response.data.productInfo[index].quantity = item.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: REMOVE_CART_ITEM,
    payload: request,
  };
}

export function onSuccessBuy(body) {
  console.log(body);
  const request = axios.post("/api/users/successBuy", body).then((response) => {
    return response.data;
  });

  return {
    type: ON_SUCCESS_BUY,
    payload: request,
  };
}
