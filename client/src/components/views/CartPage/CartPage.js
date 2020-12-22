import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";

function CartPage(props) {
  const dispatch = useDispatch();
  const userData = props.user.userData;

  useEffect(() => {
    let cartItems = [];
    if (userData && userData.cart) {
      if (userData.cart.length > 0) {
        userData.cart.forEach((item) => {
          cartItems.push(item.id);
          console.log(item);
        });
        dispatch(getCartItems(cartItems, userData.cart));
      }
    }
  }, [userData]);

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My cart</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail && props.user.cartDetail.product}
        />
      </div>
    </div>
  );
}

export default CartPage;
