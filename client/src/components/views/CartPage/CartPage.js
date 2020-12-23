import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty } from "antd";
import Paypal from "../../utils/Paypal";

function CartPage(props) {
  const dispatch = useDispatch();
  const userData = props.user.userData;

  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);

  useEffect(() => {
    let cartItems = [];
    if (userData && userData.cart) {
      if (userData.cart.length > 0) {
        userData.cart.forEach((item) => {
          cartItems.push(item.id);
          console.log(item);
        });
        dispatch(getCartItems(cartItems, userData.cart)).then((res) =>
          calculateTotal(res.payload)
        );
      }
    }
  }, [userData]);

  let calculateTotal = (cartDetail) => {
    let total = 0;
    if (cartDetail && cartDetail.length > 0) {
      cartDetail.forEach((item) => {
        total += parseInt(item.price, 10) * item.quantity;
      });
    } else {
      setTotal(0);
    }
    setTotal(total);
    setShowTotal(true);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((res) => {
      calculateTotal(res.data);
      setShowTotal(false);
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My cart</h1>
      {ShowTotal ? (
        <>
          <div>
            <UserCardBlock
              products={props.user.cartDetail}
              removeItem={removeFromCart}
            />
          </div>
          <div style={{ marginTop: "3rem" }}>
            <h2>Total Amount : ${Total}</h2>
          </div>

          <Paypal total={Total} />
        </>
      ) : (
        <>
          <Empty description={false} />
        </>
      )}
    </div>
  );
}

export default CartPage;
