import React, { useState } from "react";
import * as Scrivito from "scrivito";

import { WidgetProps, RegistryWidgetsType } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import { merge } from "lodash-es";

import Loader from "../../Components/Loader";
import Modal from "react-overlays/Modal";
import { translate } from "../../utils/translate";
import { callApiPost } from "../../api/portalApiCalls";
import { getUserUuid } from "../../Components/Auth/utils";
import FooterButtons from "./FooterButtons";
import { useTenantContext } from "../../Components/TenantContextProvider";

const CustomAttachment = function({ id, value, onChange }) {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const uploadFile = e.target.files[0];

    onChange(null);
    setFile(null);

    if (!uploadFile) {
      return;
    }

    setLoading(true);

    callApiPost("signed-upload-url", {
      filename: uploadFile.name,
    }).then(async (response) => {
      if (response.failedRequest) {
        setLoading(false);
        return;
      }
      await fetch(response.url, {
        method: "PUT",
        body: uploadFile,
      });

      onChange(response.filename);
      setFile(uploadFile);
      setLoading(false);
    });
  };

  return (
    <div>
      <div className="mb-1">
        <input id={id} name={id} type="file" onChange={onChangeHandler} />
      </div>
      {loading && (
        <small>{translate("Processing file…")}</small>
      )}
      {file && (
        <ul className="file-info">
          <li><strong>{file.name}</strong> ({[file.type, `${file.size} bytes`].filter(e => !!e).join(", ")})</li>
        </ul>
      )}
    </div>
  )
}

const widgets: RegistryWidgetsType = {
  FileWidget: CustomAttachment
};

function CreateNewTicketOverlay({ isOpen, close, chatPage }) {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const renderBackdrop = (props) => (
    <div className="sdk_mute_bg_2" {...props} />
  );

  const userUUID = getUserUuid();

  const onSubmitForm = async () => {
    setLoading(true);

    try {
      const ticketAttributes = {};
      const messageAttributes = {
        text: formData["message.text"],
        attachments: [{
          filename: formData["message.attachment"],
        }]
      };

      Object.entries(formData).forEach(([name, value]) => {
        if (!name.startsWith("message.")) {
          ticketAttributes[name] = value;
        }
      });
      const newTicket = await callApiPost("tickets", {
        ...ticketAttributes,
        message: messageAttributes,
        requester_id: userUUID,
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
    } catch (_error) {
      setLoading(false);
      setShowError(true);
    }
  };

  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const { ticketSchema } = useTenantContext();
  React.useEffect(() => {
    Scrivito.load(() => {
      const [obj] = Scrivito.Obj.onAllSites()
        .where("_objClass", "equals", "TicketFormConfiguration")
        .take(1);
      return obj;
    }).then((obj) => {
      const localUiSchema = JSON.parse(obj?.get("uiSchema") as string || "{}");
      const localSchema = JSON.parse(obj?.get("formSchema") as string || "{}");

      Object.entries(ticketSchema.properties).forEach(([attribute, schema]) => {
        Object.entries(schema as object).forEach(([key, value]) => {
          if (key.startsWith("ui:")) {
            localUiSchema[attribute] = localUiSchema[attribute] || {};
            localUiSchema[attribute][key] = value;
          }
        });
      });

      setUiSchema(localUiSchema);
      setSchema(merge(ticketSchema, localSchema));
      setFormData(localSchema.formData);
    });
  }, []);

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
          <div className="ticket-modal-form">
            <div className="overlay_content scroll_content">
              <h2>{translate("create_new_ticket")}</h2>
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
                  {translate("creation-error")}
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
