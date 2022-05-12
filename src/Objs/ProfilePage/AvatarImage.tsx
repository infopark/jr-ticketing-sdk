import React from "react";
import { translate } from "../../utils/translate";

import defaultAvatarSrc from "../../assets/images/icons/profile_img.svg";

function AvatarImage({ userAvatarSrc, loading=false }) {
  return (
    <div className="avatar">
      <img
        src={userAvatarSrc || defaultAvatarSrc}
        alt={translate("user_avatar")}
        className="d-block w-100 mb-4"
      />
      {loading && (
        <div className="dots mb-4">
          <div className="bg" />
        </div>
      )}
    </div>
  );
}

export default AvatarImage;
