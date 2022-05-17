import React, { useState, useEffect } from "react";
import * as Scrivito from "scrivito";
import SignOutLink from "./SignOutLink";
import LanguageSwitcher from "./LanguageSwitcher";
import { getPage, getLanguage } from "../utils/page";
import { translate } from "../utils/translate";

import { Dropdown } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

const CustomMenu = React.forwardRef(
  (({ children, style, className, "aria-labelledby": labeledBy }, ref) => (
    <ul
      ref={ref}
      style={style}
      className={className}
      aria-labelledby={labeledBy}
    >
      {React.Children.toArray(children).map((child) => (
        <li className="dropdown-item" key={(child as any).key}>
          {(child as any).props.children}
        </li>
      ))}
    </ul>
  )) as any
);
function ProfileMenu() {
  const [profilePage, setProfilePage] = useState(null);
  useEffect(() => {
    getPage("ProfilePage", setProfilePage, getLanguage());
  }, [getLanguage()]);
  return (
    <Dropdown.Menu className="profil_menu" as={CustomMenu}>
      <Dropdown.Item key="profile">
        {profilePage && (
          <Scrivito.LinkTag to={profilePage} className="dropdown-item">
            {translate("open_profile_page")}
          </Scrivito.LinkTag>
        )}
      </Dropdown.Item>
      <Dropdown.Item key="signout">
        <SignOutLink />
      </Dropdown.Item>
      <DropdownItem key="langswitch">
        <LanguageSwitcher />
      </DropdownItem>
    </Dropdown.Menu>
  );
}

export default Scrivito.connect(ProfileMenu);
