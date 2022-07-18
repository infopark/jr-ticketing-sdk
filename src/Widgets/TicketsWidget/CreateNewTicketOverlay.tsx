import React, { useState, useReducer } from "react";
import * as Scrivito from "scrivito";
import { trim } from "lodash";
import Loader from "../../Components/Loader";
import Modal from "react-overlays/Modal";
import { translate } from "../../utils/translate";
import { getTicketTypeFields, formReducer } from "../../api/utils";
import { callApiPost } from "../../api/portalApiCalls";
import { CDN_BASE_PATH, MAX_ATTACHMENT_SIZE } from "../../utils/constants";
import { getUserUuid } from "../../Components/Auth/utils";
import { useTenantContext } from "../../Components/TenantContextProvider";
import FooterButtons from "./FooterButtons";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import newlinesToBreaks from "../../utils/newlinesToBreaks";

function CreateNewTicketOverlay({ isOpen, close, chatPage, formFields }) {
  const { getInitialTicketStatusOpen, getTicketTypesAsOptions } =
    useTenantContext();
  const [loading, setLoading] = useState(false);
  const [uploadId, setUploadId] = useState<number | null>(null);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(
    null
  );
  const [attachmentTooBig, setAttachmentTooBig] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fieldsData, setFieldsData] = useReducer(
    formReducer,
    getInitialFieldsData(getTicketTypesAsOptions())
  );

  const renderBackdrop = (props) => <div className="mute_bg_2" {...props} />;

  const handleChange = ({ target: { name, value } }) => {
    setFieldsData({
      fld: name,
      val: value,
    });
  };
  const fieldsArray = formFields.map((field) => ({
    fld: field,
    val: fieldsData[field] || "",
  }));

  const findEmptyInput = fieldsArray.find(
    (field) => field.fld !== "attachment" && trim(field.val) === ""
  );
  const isSubmitDisabled = findEmptyInput !== undefined;
  const userUUID = getUserUuid();
  const fieldsConfig = getTicketTypeFields(getTicketTypesAsOptions());

  const onSubmitForm = (event) => {
    event.preventDefault();
    setLoading(true);
    const description = newlinesToBreaks(fieldsData.description);
    callApiPost("create-ticket", {
      ...fieldsData,
      userId: userUUID,
      description,
      status: getInitialTicketStatusOpen(fieldsData.tickettype),
    })
      .then(async (response) => {
        if (response.failedRequest) {
          setLoading(false);
          setShowError(true);
          return;
        }
        const attachmentData = attachmentFileName
          ? await callApiPost("create-cdn-object", {
              path: `attachments/${uploadId}/${attachmentFileName}`,
              uuid: response.ticketid,
              objectType: "attachment",
            }).then((resp) => {
              if (resp.failedRequest) {
                return;
              }
              return resp;
            })
          : null;

        const msgData = {
          text: `<strong>${fieldsData.title}</strong><br />${description}`,
          ticketId: response.ticketid,
          userId: userUUID,
          attachment: attachmentData
            ? `${CDN_BASE_PATH}/${attachmentData.objectPath}`
            : null,
        };
        await callApiPost("create-ticketmessage", msgData).then((res) => {
          setAttachmentFileName(null);
          return res;
        });
        Scrivito.navigateTo(chatPage, {
          ticketid: response.ticketid,
        });
      })
      .catch((_error) => {
        setLoading(false);
        setShowError(true);
      });
  };
  const handleAttachmentChange = (e) => {
    const files = e.target && e.target.files;
    const uploadFile = files[0];
    const size = (uploadFile && uploadFile.size) || 0;
    const fileName = uploadFile && uploadFile.name;
    if (size > MAX_ATTACHMENT_SIZE) {
      setAttachmentTooBig(true);
      return;
    }
    if (!uploadFile) {
      setAttachmentTooBig(false);
      return;
    }
    setAttachmentTooBig(false);
    const timestamp = Date.now();
    setAttachmentLoading(true);
    callApiPost("get-signed-upload-url", {
      fileName: `attachments/${timestamp}/${fileName}`,
    }).then(async (response) => {
      if (response.failedRequest) {
        setAttachmentLoading(false);
        return;
      }
      await fetch(response.uploadUrl, {
        method: "PUT",
        body: uploadFile,
      });
      setUploadId(timestamp);
      setAttachmentFileName(`${uploadFile.name}`);
      setAttachmentLoading(false);
    });
  };
  return (
    <Modal
      show={isOpen}
      onHide={
        ((event) => {
          close(event);
        }) as any
      }
      renderBackdrop={renderBackdrop}
      autoFocus={false}
    >
      <div className="sdk sdk-tickets-widget">
        <section id="overlay" className="ticket-modal-section">
          {loading && (
            <div className="loader_overlay">
              <Loader bg="bg_color_transparent" />
            </div>
          )}
          <form className="ticket-modal-form" onSubmit={onSubmitForm}>
            <div className="overlay_content scroll_content">
              <h2>{translate("create_new_ticket")}</h2>
              <div className="inline_form">
                {formFields.map((fieldName, index) => {
                  const fieldConfig = fieldsConfig[fieldName];
                  if (!fieldConfig) {
                    return null;
                  }
                  return fieldConfig.tag !== "textarea" ? (
                    <InputField
                      fieldConfig={fieldConfig}
                      fieldName={fieldName}
                      onChange={
                        fieldConfig.type === "file"
                          ? handleAttachmentChange
                          : handleChange
                      }
                      loading={attachmentLoading}
                      key={`f_${index}`}
                    />
                  ) : (
                    <TextareaField
                      fieldConfig={fieldConfig}
                      fieldName={fieldName}
                      onChange={handleChange}
                      key={`f_${index}`}
                    />
                  );
                })}
              </div>
              {showError && (
                <div
                  className="alert alert-danger box radius mt-4"
                  role="alert"
                >
                  {translate("creation-error")}
                </div>
              )}
            </div>
            <FooterButtons
              handleCancelClick={close}
              disabled={
                isSubmitDisabled || attachmentLoading || attachmentTooBig
              }
            />
          </form>
        </section>
      </div>
    </Modal>
  );
}

function getInitialFieldsData(ticketOptions) {
  if (!ticketOptions || !ticketOptions.length) {
    return {};
  }
  return { tickettype: ticketOptions[0].value };
}

export default CreateNewTicketOverlay;
