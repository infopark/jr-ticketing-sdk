import React from "react";
import { translate } from "../../utils/translate";
import classNames from "classnames";
import AvatarImage from "./AvatarImage";

function EditAvatarImage({
  newAvatar,
  userAvatarSrc,
  handleAvatarChange,
  loading,
}) {
  return (
    <dl>
      <dt
        className={classNames("regular item_label", {
          avatar_loading: loading,
        })}
      >
        <AvatarImage
          userAvatarSrc={newAvatar || userAvatarSrc}
          loading={loading}
        />
      </dt>
      {!loading && (
        <dd className="item_label_content">
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            accept=".jpg, .jpeg, .png, .svg"
            onChange={handleAvatarChange}
            hidden
          />
          <label htmlFor="fileUpload">
            <span className="btn btn-secondary avatar_edit_btn mb-4">
              {translate("change_avatar")}
            </span>
          </label>
        </dd>
      )}
    </dl>
  );
}

export default EditAvatarImage;
