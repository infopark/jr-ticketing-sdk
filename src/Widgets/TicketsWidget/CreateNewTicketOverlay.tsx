import React, { useState } from "react";
import * as Scrivito from "scrivito";

import { RegistryWidgetsType } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

import i18n from "../../config/i18n";
import Loader from "../../Components/Loader";
import Modal from "react-overlays/Modal";
import { callApiPost } from "../../api/portalApiCalls";
import FooterButtons from "./FooterButtons";
import { useTenantContext } from "../../Components/TenantContextProvider";
import { Keyable } from "../../utils/types";

const CustomAttachment = function({ id, value, onChange }) {
  const [files, setFiles] = useState<object[]>([]);

  function updateFiles(fileObject) {
    setFiles((files) => files.map((f) => f === fileObject ? fileObject : f));
  }

  function uploadFile(fileList: FileList) {
    Array.from(fileList).forEach(async (file: Keyable) => {
      const fileObject = {
        name: file.name,
        loading: true,
        error: false
      };
      setFiles(files => [...files, fileObject]);

      const signedResult = await callApiPost("signed-upload-url", {
        filename: file.name,
      });

      if (signedResult.failedRequest) {
        fileObject.error = true;
        fileObject.loading = false;
        updateFiles(fileObject);
        return;
      }

      const uploadResult = await fetch(signedResult.url, {
        method: "PUT",
        body: file as BodyInit,
      });

      if (uploadResult.status >= 200 && uploadResult.status < 300) {
        onChange([...value, signedResult.filename]);
      } else {
        fileObject.error = true;
      }
      fileObject.loading = false;
      updateFiles(fileObject);
    });
  }

  function removeUpload(file: object) {
    setFiles(files.filter(f => f !== file));
  }

  return (
    <div>
      <div className="mb-1">
        <label htmlFor={id} className="btn btn-secondary btn-sm px-2 py-1 with-btn-lnf">
          {i18n.t("attach file")}
          <input
            type="file"
            id={id}
            name={id}
            value=""
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files)}
            hidden
            multiple
          />
        </label>
      </div>
      {files.map((file: Keyable) => (
        <div className="attachment_file mb-0" key={file.name}>
          <div className="dots">
            {file.name}
            {" "}
            {file.loading && i18n.t("Processing file…")}
            {file.error && i18n.t("Failed")}
          </div>
          <div className="delete_file pointer" onClick={() => removeUpload(file)}>
            x
          </div>
        </div>
      ))}
    </div>
  );
};

const widgets: RegistryWidgetsType = {
  FileWidget: CustomAttachment
};

function CreateNewTicketOverlay({
  isOpen,
  close,
  chatPage
}: {
  isOpen: boolean,
  close: React.MouseEventHandler<HTMLElement>,
  chatPage: Scrivito.Obj
}) {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const renderBackdrop = (props) => (
    <div className="sdk_mute_bg_2" {...props} />
  );

  const { userId } = useTenantContext();

  const onSubmitForm = async () => {
    setLoading(true);

    try {
      const ticketAttributes = {};
      const messageAttributes = {
        text: formData["message.text"],
        attachments: formData["message.attachments"]?.map(attachment => ({
          filename: attachment,
        }))
      };

      Object.entries(formData).forEach(([name, value]) => {
        if (!name.startsWith("message.")) {
          ticketAttributes[name] = value;
        }
      });
      const newTicket = await callApiPost("tickets", {
        ...ticketAttributes,
        message: messageAttributes,
        requester_id: userId,
        status: "new",
      });

      if (newTicket.failedRequest) {
        setLoading(false);
        setShowError(true);
        return;
      }

      Scrivito.navigateTo(chatPage, {
        ticketid: newTicket.id,
      });
    } catch (error) {
      setLoading(false);
      setShowError(true);
    }
  };

  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const { ticketSchema, ticketUiSchema } = useTenantContext();

  React.useEffect(() => {
    if (ticketSchema && ticketUiSchema) {
      const localSchema = { ...ticketSchema, properties: {} };
      const localUiSchema = { ...ticketUiSchema };

      Object.entries(ticketSchema.properties).forEach(([attribute, schema]: [string, any]) => {
        // Don't render hidden attributes unless they have a default value
        const uiSchema = ticketUiSchema[attribute] || {};
        if (uiSchema["ui:widget"] !== "hidden" || schema["default"]) {
          localSchema.properties[attribute] = schema;
        }
        Object.entries(schema).forEach(([key, value]) => {
          if (key.startsWith("ui:")) {
            localUiSchema[attribute] ||= {};
            localUiSchema[attribute][key] = value;
          }
        });
      });

      setSchema(localSchema);
      setUiSchema(localUiSchema);
    }
  }, [ticketSchema, ticketUiSchema]);

  return (
    <Modal
      show={isOpen}
      onHide={
        ((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
          <div className="ticket-modal-form">
            <div className="overlay_content scroll_content">
              <h2>{i18n.t("create_new_ticket")}</h2>
              <div className="inline_form">
                <Form
                  formData={formData}
                  schema={schema}
                  uiSchema={uiSchema}
                  validator={validator}
                  widgets={widgets}
                  onChange={(e) => setFormData(e.formData)}
                  onSubmit={onSubmitForm}
                  onError={() => console.log("errors")}
                > </Form>
              </div>
              {showError && (
                <div
                  className="alert alert-danger box radius mt-4"
                  role="alert"
                >
                  {i18n.t("creation-error")}
                </div>
              )}
            </div>
            <FooterButtons
              onSubmit={onSubmitForm}
              onCancel={close}
              disabled={false}
            />
          </div>
        </section>
      </div>
    </Modal>
  );
}

export default CreateNewTicketOverlay;
