import React from "react";
import "./header.css";
import logo from "../../assets/piskel-logo.png";

const Header = () => {
  return (
    <header className="header">
      <h1>
        <img className="header__logo" src={logo} alt="piskel logo" />
      </h1>
      <div className="header__title">New Piskel</div>
      <a className="header__create-sprite-button" href="/" target="_blank">
        Create Sprite
      </a>
    </header>
  );
};

export default Header;
