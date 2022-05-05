import React from "react";
import classNames from "classnames";
import logo from "src/assets/images/ip_logos/logo_loader.svg";

const Loader = ({ comp=undefined as string | undefined, bg }) => (
  <div className={classNames("jr_loader", comp, bg)}>
    <img src={logo} alt="JustRelate Group" />
  </div>
);

export default Loader;
