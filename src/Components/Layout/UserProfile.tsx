import React, { useState } from "react";
import * as Scrivito from "scrivito";
import { useUserData } from "../UserDataContext";

import defaultProfile from "../../assets/images/icons/profile_img.svg";

import { Dropdown } from "react-bootstrap";
import ProfileMenu from "../ProfileMenu";

function UserProfile({ beforeOpen }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { userData } = useUserData();
  const avatar = userData && userData.avatarurl || defaultProfile;
  const name = `${userData && userData.firstname || ""} ${userData && userData.lastname || ""}`;
  const email = userData && userData.email;

  const setVisible = (visible) => {
    if (visible && beforeOpen) {
      beforeOpen();
    }
    setMenuVisible(visible);
  };
  return (
    <Dropdown
      className="profil_btn"
      show={menuVisible}
      onClick={() => setVisible(!menuVisible)}
      onToggle={(isOpen) => {
        if (!isOpen) {
          setVisible(false);
        }
      }}
    >
      <Dropdown.Toggle variant="secondary">
        <img src={avatar} alt="user profile" className="profil_img" />
        <span className="profil not_mobile">
          <span className="profil_name dots">{name}</span>
          <span className="profil_mail dots">
            <small>{email}</small>
          </span>
        </span>
      </Dropdown.Toggle>
      <ProfileMenu />
    </Dropdown>
  );
}

export default Scrivito.connect(UserProfile);
