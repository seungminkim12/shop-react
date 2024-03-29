import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy,
} from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty, Result } from "antd";
import Paypal from "../../utils/Paypal";

function CartPage(props) {
  const dispatch = useDispatch();
  const userData = props.user.userData;

  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cartItems = [];

    //userData를 불러오고 userdata안 cart도 불러왔을때
    if (userData && userData.cart) {
      //리덕스 user State 안 cart 상품이 있는경우
      if (userData.cart.length > 0) {
        userData.cart.forEach((item) => {
          cartItems.push(item.id);
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

  const trasactionSuccess = (data) => {
    dispatch(
      onSuccessBuy({ paymentData: data, cartDetail: props.user.cartDetail })
    ).then((res) => {
      if (res.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
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

          <Paypal total={Total} onSuccess={trasactionSuccess} />
        </>
      ) : ShowSuccess ? (
        <Result status="success" title="Successfully Purchased Items" />
      ) : (
        <>
          <Empty description={false} />
        </>
      )}
    </div>
  );
}

export default CartPage;
