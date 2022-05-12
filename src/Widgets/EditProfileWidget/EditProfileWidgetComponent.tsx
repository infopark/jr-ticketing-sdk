import React from "react";
import * as Scrivito from "scrivito";
import { useUserData } from "../../Components/UserDataContext";

Scrivito.provideComponent("EditProfileWidget", (({ widget }) => {
  const { userData } = useUserData();
  if (!userData || !userData.avatarurl || Scrivito.isEditorLoggedIn()) {
    return (
      <Scrivito.ContentTag
        className="edit-profile-widget"
        content={widget}
        attribute="widget"
      />
    );
  }
  return null;
}) as any);
