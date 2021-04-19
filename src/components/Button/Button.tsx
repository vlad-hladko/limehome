import React from "react";

import classes from "./Button.module.css";

export const Button: React.FC = ({ children, ...props }) => {
  return (
    <button className={classes.root} {...props}>
      {children}
    </button>
  );
};
