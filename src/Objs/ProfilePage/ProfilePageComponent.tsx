import React, { useState, useReducer, useEffect } from "react";
import * as Scrivito from "scrivito";
import useAPIError from "../../utils/useAPIError";
import { useUserData } from "../../Components/UserDataContext";
import { translate } from "../../utils/translate";
import { CDN_BASE_PATH } from "../../utils/constants";
import { callApiPost } from "../../api/portalApiCalls";
import getUserData from "../../api/getUserData";
import { formReducer, getEditableUserFields } from "../../api/utils";
import { removeUserLanguageHandledFlag } from "../../Components/Auth/utils";
import ScrollHeader from "./ScrollHeader";
import EditProfileOverlay from "./EditProfileOverlay";
import ReadModeContent from "./ReadModeContent";

Scrivito.provideComponent("ProfilePage", () => {
  const { userData, updateUserData } = useUserData();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [mode, setMode] = useState(getInitialPageMode());
  const [fieldsData, setFieldsData] = useReducer(formReducer, {});
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState(null);
  const { addError } = useAPIError();

  useEffect(() => {
    let canceled = false;
    callApiPost(`get-user/${userData.userid}`, {})
      .then((response) => {
        if (response.failedRequest) {
          return undefined;
        }
        return response[0];
      })
      .then((currentProfile) => {
        if (currentProfile && !canceled) {
          updateUserData(currentProfile);
        }
      });

    return () => {
      canceled = true;
    };
  }, [userData.userid, updateUserData]);

  const handleInputChange = (event) => {
    setFieldsData({
      fld: event.target.name,
      val: event.target.value,
    });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setAvatarLoading(true);
    await callApiPost("get-signed-upload-url", {
      fileName: `avatars/${userData.userid}/${file.name}`,
    })
      .then(async (response) => {
        if (response.failedRequest) {
          setAvatarLoading(false);
          return;
        }
        await fetch(response.uploadUrl, {
          method: "PUT",
          body: file,
        });
        setAvatarLoading(false);
        setAvatarFileName(file.name);
      })
      .catch((err) => {
        addError("PROFILE_PAGE, ", err, "ProfilePageComponent");
      });
    setNewAvatar(file);
  };

  const fieldsArray = Object.keys(fieldsData).map((key) => ({
    fld: key,
    val: fieldsData[key],
  }));

  function handleEditClick() {
    setMode("edit");
    setNewAvatar(null);
  }

  function handleCancelEditClick() {
    setMode("read");
    setFieldsData(null);
    setNewAvatar(null);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    unlockLanguageRedirect();

    if (avatarFileName) {
      await callApiPost("create-cdn-object", {
        path: `avatars/${userData.userid}/${avatarFileName}`,
        uuid: userData.userid,
        objectType: "avatar",
      }).then((response) => {
        if (response.failedRequest) {
          return;
        }
        callApiPost(`update-user/${userData.userid}`, {
          avatarurl: `${CDN_BASE_PATH}/${response.objectPath}`,
        });
      });
    }
    try {
      const response = await callApiPost(
        `update-user/${userData.userid}`,
        fieldsData
      );
      if (response) {
        if (!response.failedRequest) {
          const data = await getUserData();
          updateUserData(data);
          setLoading(false);
          setMode("read");
          setFieldsData(null);
        } else {
          setLoading(false);
          setFieldsData(null);
          setMode("read");
        }
      }
    } catch (error) {
      setLoading(false);
      setFieldsData(null);
      setMode("read");
    }
  }

  const unlockLanguageRedirect = () => {
    if (fieldsData.language && fieldsData.language !== userData.language) {
      removeUserLanguageHandledFlag();
    }
  };

  const editableUserFields = getEditableUserFields();

  if (!userData) {
    return null;
  }

  return (
    <div className="col-lg-12 sdk sdk-profil">
      <ScrollHeader
        buttonText={translate("back")}
        onClick={() => {
          window.history.back();
        }}
      />
      <ReadModeContent
        userAvatarSrc={userData.avatarurl}
        userFields={editableUserFields}
        user={userData}
        onEditClick={handleEditClick}
      />
      <EditProfileOverlay
        onHide={() => setMode("read")}
        show={mode === "edit"}
        loading={loading}
        userDataFields={editableUserFields}
        user={userData}
        handleInputChange={handleInputChange}
        mode={mode}
        userAvatarSrc={userData.avatarurl}
        handleCancelEditClick={handleCancelEditClick}
        handleAvatarChange={handleAvatarChange}
        fieldsArray={fieldsArray}
        avatarChanged={!!newAvatar}
        avatarLoading={avatarLoading}
        newAvatar={newAvatar ? URL.createObjectURL(newAvatar) : null}
        handleSubmit={handleSubmit}
      />
    </div>
  );
});

function getInitialPageMode() {
  if (!window.URLSearchParams) {
    return "read";
  }
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("mode") === "edit") {
    return "edit";
  }
  return "read";
}
