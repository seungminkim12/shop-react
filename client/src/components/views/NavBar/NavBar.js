import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";
import { useSelector } from "react-redux";
import logo from "./logo.ico";

function NavBar(props) {
  const user = useSelector((state) => state.user);

  const [visible, setVisible] = useState(false);
  const [CartCount, setCartCount] = useState(0);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const drawCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <nav
      className="menu"
      style={{ position: "fixed", zIndex: 5, width: "100%" }}
    >
      <div className="menu__logo">
        <a href="/">
          <img
            alt="logo"
            src={logo}
            style={{ width: "30px", height: "30px" }}
          />
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu
            mode="horizontal"
            showCartCount={drawCartCount}
            cart={CartCount}
          />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title={user.userData ? user.userData.name : ""}
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu
            mode="inline"
            showCartCount={drawCartCount}
            cart={CartCount}
          />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
