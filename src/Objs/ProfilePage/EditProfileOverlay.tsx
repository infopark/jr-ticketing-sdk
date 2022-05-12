import React from "react";
import Modal from "react-overlays/Modal";

import { translate } from "../../utils/translate";

import Loader from "../../Components/Loader";
import EditUserDataRow from "./EditUserDataRow";
import EditAvatarImage from "./EditAvatarImage";
import FooterButtons from "./FooterButtons";

function EditProfileOverlay({
  loading,
  userDataFields,
  user,
  handleInputChange,
  mode,
  userAvatarSrc,
  handleCancelEditClick,
  handleAvatarChange,
  fieldsArray,
  avatarChanged,
  newAvatar,
  handleSubmit,
  onHide,
  show,
  avatarLoading,
}) {
  const renderBackdrop = (props) => <div className="mute_bg_2" {...props} />;
  return (
    <Modal
      show={show}
      onHide={onHide}
      renderBackdrop={renderBackdrop}
      autoFocus={false}
    >
      <section id="overlay">
        {loading && (
          <div className="loader_overlay">
            <Loader bg="bg_color_transparent" />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="overlay_content scroll_content">
            <h2>{translate("profile")}</h2>
            <div className="inline_form">
              <EditAvatarImage
                newAvatar={newAvatar}
                userAvatarSrc={userAvatarSrc}
                handleAvatarChange={handleAvatarChange}
                loading={avatarLoading}
              />
              {userDataFields.map((field, index) => (
                <EditUserDataRow
                  user={user}
                  onInputChange={handleInputChange}
                  label={translate(field.label)}
                  fieldName={field.name}
                  key={`edit_user_data_${index}`}
                  editable={field.editable}
                  options={field.options}
                  type={field.type}
                />
              ))}
            </div>
          </div>
          <FooterButtons
            handleCancelEditClick={handleCancelEditClick}
            disabled={!fieldsArray.length && !avatarChanged}
          />
        </form>
      </section>
    </Modal>
  );
}

export default EditProfileOverlay;
