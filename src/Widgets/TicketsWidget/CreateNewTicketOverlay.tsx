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
  const { getInitialTicketStatusOpen, getTicketTypesAsOptions } = useTenantContext();
  const [loading, setLoading] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(
    null
  );
  const [attachmentTooBig, setAttachmentTooBig] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fieldsData, setFieldsData] = useReducer(formReducer, {});

  const renderBackdrop = (props) => (
    <div className="sdk_mute_bg_2" {...props} />
  );

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
  const fieldsConfig = getTicketTypeFields();

  const onSubmitForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const newTicket = await callApiPost("tickets", {
        title: fieldsData.title,
        type: fieldsData.type,
        requester_id: userUUID,
        status: "new",
      });

      if (newTicket.failedRequest) {
        setLoading(false);
        setShowError(true);
        return;
      }

      const msgData = {
        text: fieldsData.description,
        ticket_id: newTicket.id,
        user_id: userUUID,
        attachments: [] as object[],
      };

      if (!!attachmentFileName) {
        msgData.attachments.push({
          filename: attachmentFileName
        });
      }

      await callApiPost(`tickets/${newTicket.id}/messages`, msgData).then((res) => {
        setAttachmentFileName(null);
        return res;
      });
      Scrivito.navigateTo(chatPage, {
        ticketid: newTicket.id,
      });
    } catch (_error) {
      setLoading(false);
      setShowError(true);
    }
  };

  const handleAttachmentChange = (e) => {
    const uploadFile = e.target.files[0];
    const size = (uploadFile && uploadFile.size) || 0;

    if (!uploadFile) {
      setAttachmentTooBig(false);
      return;
    }

    if (size > MAX_ATTACHMENT_SIZE) {
      setAttachmentTooBig(true);
      return;
    }

    setAttachmentTooBig(false);
    setAttachmentLoading(true);

    callApiPost("signed-upload-url", {
      filename: uploadFile.name,
    }).then(async (response) => {
      if (response.failedRequest) {
        setAttachmentLoading(false);
        return;
      }
      await fetch(response.url, {
        method: "PUT",
        body: uploadFile,
      });
      setAttachmentFileName(response.filename);
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
      <div className="sdk">
        <section id="overlay" className="ticket-modal-section">
          {loading && (
            <div className="sdk loader_overlay">
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

export default CreateNewTicketOverlay;
