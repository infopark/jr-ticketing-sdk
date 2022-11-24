import { getTimeLocales } from "../utils/dateUtils";
import { getLanguageVersions } from "../utils/page";
import { isoToLanguageName, translate } from "../utils/translate";

const formReducer = (state, event) => {
  // clear fields array after cancel form
  if (event === null) {
    return {};
  }
  if (state) {
    return {
      ...state,
      [event.fld]: event.val,
    };
  }
};

const getEditableUserFields = () => [
  { label: "First name", name: "first_name", editable: true },
  { label: "Last name", name: "last_name", editable: true },
  { label: "Position", name: "position", editable: true },
  { label: "Phone number", name: "phone_number", editable: true },
  { label: "Email address", name: "email", editable: false },
  { label: "Company name", name: "organisation", editable: false },
  {
    label: "Language",
    name: "language",
    editable: true,
    options: getLanguageVersions().map((version) => ({
      value: version.language(),
      name: isoToLanguageName(version.language()!)
    })),
    type: "radio",
  },
  {
    label: "Time locale",
    name: "timelocale",
    editable: true,
    options: getTimeLocales().map((timeLocale) => ({
      value: timeLocale.iso,
      name: timeLocale.name,
    })),
    type: "select",
  },
];

export { formReducer, getEditableUserFields };
