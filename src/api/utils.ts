import { getTimeLocales } from "../utils/dateUtils";
import { MAX_ATTACHMENT_SIZE } from "../utils/constants";
import {
  inputMaxSize,
  inputMinSize,
  attachmentSize,
} from "../utils/inputValidations";
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

const availableFieldsConfig = {
  type: {
    tag: "select",
    type: null,
    labelName: "Ticket Type",
    placeholder: "Ticket Type",
    selectOptions: [
      { name: "Please choose ticket type", value: "" },
      { name: "problem", value: "problem" },
      { name: "task", value: "task" },
      { name: "question", value: "question" },
    ],
    disabled: false,
    tooltip: ""
  },
  title: {
    tag: "input",
    type: "text",
    labelName: "Ticket Subject",
    placeholder: "Please enter a subject",
    validations: [
      {
        validator(e, constraint) {
          return inputMaxSize(e, constraint);
        },
        constraint: 80,
        message: "Subject must be 80 characters or less",
      },
      {
        validator(e, constraint) {
          return inputMinSize(e, constraint);
        },
        constraint: 1,
        message: "Subject cannot be empty",
      },
    ],
  },
  description: {
    tag: "textarea",
    type: null,
    labelName: "Description",
    placeholder: "Please describe your request in a few sentences",
    validations: [
      {
        validator(e, constraint) {
          return inputMinSize(e, constraint);
        },
        constraint: 1,
        message: "Description cannot be empty",
      },
    ],
  },
  attachment: {
    tag: "input",
    type: "file",
    labelName: "Attachment",
    placeholder: "Provide a supplementary attachment",
    hint: "Please upload files up to 20 MB",
    validations: [
      {
        validator(e, constraint) {
          return attachmentSize(e, constraint);
        },
        constraint: MAX_ATTACHMENT_SIZE,
        message: "The size of your attachment exceeds 20 MB",
      },
    ],
  },
};

const getTicketTypeFields = () => {
  // availableFieldsConfig.tickettype.disabled = typeOptions.length < 2;
  // if (typeOptions.length === 1) {
  //   availableFieldsConfig.tickettype.tooltip =
  //     "Please report an issue of this type only";
  // }
  // availableFieldsConfig.tickettype.selectOptions = typeOptions;
  return availableFieldsConfig;
};

const getEditableUserFields = () => [
  { label: "First name", name: "firstname", editable: true },
  { label: "Last name", name: "lastname", editable: true },
  { label: "Position", name: "position", editable: true },
  { label: "Phone number", name: "phonenumber", editable: true },
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

export { getTicketTypeFields, formReducer, getEditableUserFields };
