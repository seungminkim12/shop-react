import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";

function CartPage(props) {
  const dispatch = useDispatch();

  useState(() => {
    const userData = props.user.userData;

    let cartItem = [];

    //Redux User state 안 Cart에 상품이 있는지 확인
    if (userData && userData.cart) {
      if (userData.cart.length > 0) {
        userData.cart.forEach((item) => {
          cartItem.push(item.id);
        });
        dispatch(getCartItems(cartItem, userData.cart));
      }
    }
  }, [props.user.userData]);

  return <div></div>;
}

export default CartPage;
