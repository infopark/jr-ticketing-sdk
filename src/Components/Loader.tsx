import React from "react";
import classNames from "classnames";
import logo from "../assets/images/ip_logos/logo_loader.svg";

const Loader = ({
  comp = undefined as string | undefined,
  bg = undefined as string | undefined,
}) => (
  <div className="sdk">
    <div className={classNames("jr_loader", comp, bg)}>
      <img src={logo} alt="JustRelate Group" />
    </div>
  </div>
);

export default Loader;
