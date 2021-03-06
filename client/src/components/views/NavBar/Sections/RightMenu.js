/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Menu, Icon, Badge } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  console.log(props);

  // useEffect(() => {
  //   if (user.userData && user.userData.cart && user.userData.cart.length > 0) {
  //     props.showCartCount(user.userData.cart.length);
  //   } else {
  //     props.showCartCount(0);
  //   }
  // }, [user]);

  const logoutHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  //로그인 안됐을때
  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
<<<<<<< HEAD
      <Menu mode={props.mode}>
        <Menu.Item key="history">
          <a href="/history">History</a>
        </Menu.Item>
        <Menu.Item key="upload">
          <a href="/product/upload">Upload</a>
        </Menu.Item>
        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={user.userData && user.userData.cart.length}>
            <a href="/user/cart" style={{ marginRight: -22, color: "#66777" }}>
              <Icon
                type="shopping-cart"
                style={{ fontSize: 30, marginBottom: 3 }}
              />
            </a>
          </Badge>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
=======
      <>
        <Menu mode={props.mode}>
          {user.userData && user.userData.isAdmin && (
            <Menu.Item key="upload">
              <a href="/product/upload">Upload</a>
            </Menu.Item>
          )}
          <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
            <Badge count={props.cart}>
              <a
                href="/user/cart"
                style={{ marginRight: -22, color: "#66777" }}
              >
                <Icon
                  type="shopping-cart"
                  style={{ fontSize: 30, marginBottom: 3 }}
                />
              </a>
            </Badge>
          </Menu.Item>
          <Menu.Item key="logout">
            <a onClick={logoutHandler}>Logout</a>
          </Menu.Item>
        </Menu>
      </>
>>>>>>> proxyTest
    );
  }
}

export default withRouter(RightMenu);
