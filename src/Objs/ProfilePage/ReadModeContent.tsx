import React from "react";
import { translate } from "../../utils/translate";
import { find } from "lodash";

import AvatarImage from "./AvatarImage";
import ContentWrapper from "./ContentWrapper";
import PersonalDataRow from "./PersonalDataRow";
import { mapLocale } from "../../utils/dateUtils";

function ReadModeContent({ userAvatarSrc, userFields, user, onEditClick }) {
  return (
    <ContentWrapper>
      <div className="d-flex align-items-center mb-4">
        <h2 className="reset-mb">{translate("profile_your_data")}</h2>
        <button className="btn btn-primary ml-4" onClick={() => onEditClick()}>
          {translate("edit_profile")}
        </button>
      </div>
      <AvatarImage userAvatarSrc={userAvatarSrc} />
      {userFields.map((field, index) => (
        <PersonalDataRow
          key={`profile_${index}`}
          label={translate(field.label)}
          value={getValue(field, user)}
        />
      ))}
    </ContentWrapper>
  );
}

const getValue = (field, user) => {
  switch (field.name) {
    case "timelocale": {
      const rawValue = mapLocale(user[field.name]);
      const chosenOption = find(
        field.options,
        (option) => option.value === rawValue
      );
      const value = chosenOption ? translate(chosenOption.name) : rawValue;
      return value;
    }
    case "language": {
      const chosenOption = find(
        field.options,
        (option) => option.value === user[field.name]
      );
      const value = chosenOption ? translate(chosenOption.name) : translate(user[field.name]);
      return value;
    }
    default: {
      const chosenOption = find(
        field.options,
        (option) => option.value === user[field.name]
      );
      const value = chosenOption ? translate(chosenOption.name) : user[field.name];
      return value;
    }
  }
};

export default ReadModeContent;
