import React from "react";
import * as Scrivito from "scrivito";
import { isEmpty } from "lodash-es";
import Modal from "react-overlays/Modal";

import { RegistryWidgetsType } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

import i18n from "../../config/i18n";
import Loader from "../../Components/Loader";
import TicketingApi from "../../api/TicketingApi";
import FooterButtons from "./FooterButtons";
import { useTicketingContext } from "../../Components/TicketingContextProvider";
import { MAX_ATTACHMENT_SIZE } from "../../utils/constants";
import { FileObject, Keyable } from "../../utils/types";

const CustomAttachment = function({ id, value, onChange }) {
  const { addError } = useTicketingContext();
  const [files, setFiles] = React.useState<object[]>([]);

  function updateFiles(fileObject) {
    setFiles((files) => files.map((f) => f === fileObject ? fileObject : f));
  }

  function uploadFile(fileList: FileList) {
    const filenames = [...value];

    Array.from(fileList).forEach(async (file: Keyable) => {
      const size = file.size || 0;
      const fileObject: FileObject = {
        name: file.name,
        size: file.size,
        filename: "",
        loading: true,
        error: ""
      };
      setFiles(files => [...files, fileObject]);

      if (size > MAX_ATTACHMENT_SIZE) {
        fileObject.error = "file_too_big";
        fileObject.loading = false;
        updateFiles(fileObject);
        return;
      }

      try {
        const signedResult = await TicketingApi.post("signed-upload-url", {
          data: {
            filename: file.name,
          }
        });

        if (!signedResult) {
          fileObject.error = "file_upload_failed";
          fileObject.loading = false;
          updateFiles(fileObject);
          return;
        }

        const uploadResult = await fetch(signedResult.url, {
          method: "PUT",
          body: file as BodyInit,
        });

        if (uploadResult.status >= 200 && uploadResult.status < 300) {
          filenames.push(signedResult.filename);
          onChange(filenames);
        } else {
          fileObject.error = "file_upload_failed";
        }
        fileObject.loading = false;
        updateFiles(fileObject);
      } catch (error) {
        addError("Error uploading file", "CreateNewTicketOverlay", error);
      }
    });
  }

  function removeUpload(file: object) {
    setFiles(files.filter(f => f !== file));
  }

  return (
    <div>
      <div className="mb-1 file-upload">
        <input
          type="file"
          id={id}
          name={id}
          value=""
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files)}
          multiple
        />
        <small>{i18n.t("CreateNewTicket.file_upload_hint")}</small>
      </div>

      {files.map((file: Keyable, index: number) => (
        <div className="file-loading-card" key={`${index}-${file.name}`}>
          <div className="card">
            <div className="card-body">
              <div className="inline-nowrap-area">
                <i className="fa-regular fa-file pe-2" />
                <h5 className="card-title dots">
                  {decodeURIComponent(file.name)}
                </h5>

                <p className="card-text">{Math.round(file.size / 1024)}KB</p>

                {file.loading && (
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                )}

                {!isEmpty(file.error) && i18n.t(`CreateNewTicket.${file.error}`)}
              </div>
              <button className="btn" type="button" aria-label="Delete" onClick={() => removeUpload(file)}>
                <i className="fa-regular fa-circle-xmark" />
              </button>
            </div>
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
  ticketPage,
  ticketUiSchema,
}: {
  isOpen: boolean,
  close: React.MouseEventHandler<HTMLElement>,
  ticketPage: Scrivito.Obj,
  ticketUiSchema: Keyable,
}) {
  const [loading, setLoading] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const renderBackdrop = (props) => (
    <div className="mute_bg_2" {...props} />
  );

  const { currentUser, addError } = useTicketingContext();

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

      const newTicket = await TicketingApi.post("tickets", {
        data: {
          ...ticketAttributes,
          message: messageAttributes,
          requester_id: currentUser?.id,
          status: "new",
        }
      });

      if (!newTicket) {
        setLoading(false);
        setShowError(true);
        return;
      }

      Scrivito.navigateTo(ticketPage, {
        ticketid: String(newTicket.number),
      });
    } catch (error) {
      addError("Error submitting ticket", "CreateNewTicketOverlay", error);
      setLoading(false);
      setShowError(true);
    }
  };

  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [ticketSchema, setTicketSchema] = React.useState<Keyable | null>();
  const { prepareTicketSchema, instance } = useTicketingContext();

  React.useEffect(() => {
    setTicketSchema(
      prepareTicketSchema(ticketUiSchema, instance)
    );
  }, [ticketUiSchema, instance]);

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
      <div className="jr-ticketing-sdk sdk">
        <section id="overlay" className="ticket-modal-section">
          {loading && (
            <div className="sdk loader_overlay">
              <Loader bg="bg_color_transparent" />
            </div>
          )}
          <div className="ticket-modal-form">
            <div className="overlay_content scroll_content">
              <h2>{i18n.t("CreateNewTicket.create_new_ticket")}</h2>
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
