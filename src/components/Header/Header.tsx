import React from "react";
import { burgerIcon, logo } from "../../assets";

import classes from "./Header.module.css";

export const Header = () => {
  return (
    <div className={classes.root}>
      <a className={classes.logo} href="/">
        <img alt="limehome" src={logo} />
      </a>

      <div className={classes.menu}>
        <img alt="Menu" src={burgerIcon} />
      </div>
    </div>
  );
};
