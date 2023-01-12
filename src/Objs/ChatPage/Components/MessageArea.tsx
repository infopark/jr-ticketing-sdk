import React, { useState } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash-es";

import { callApiPost } from "../../../api/portalApiCalls";
import { MAX_ATTACHMENT_SIZE } from "../../../utils/constants";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import i18n from "../../../config/i18n";
import { FileObject, Keyable } from "../../../utils/types";

const MessageArea = ({ ticketId, refreshCallback, isClosed }) => {
  const { userId } = useTenantContext();
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileObject[]>([]);
  const [textareaHeight, setTextareaHeight] = useState<number>(85);

  const filesError = files.some((f: Keyable) => !isEmpty(f.error));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 || e.keyCode === 8) {
      const numberOfLineBreaks = (message.match(/\n/g) || []).length;
      const newHeight = 45 + numberOfLineBreaks * 20;
      setTextareaHeight(newHeight);
    }
  };

  const onSubmit = async () => {
    if (isClosed) {
      return;
    }

    const attachments = files.reduce(
      (result: object[], file) => file.filename
        ? [...result, { filename: file.filename}]
        : result, []);

    const msgData = {
      text: newlinesToBreaks(message),
      user_id: userId,
      attachments: attachments
    };


    callApiPost(`tickets/${ticketId}/messages`, msgData).then((response) => {
      setTextareaHeight(85);
      setFiles([]);
      setMessage("");
      if (!response.failedRequest) {
        refreshCallback();
      }
      return response;
    });
  };

  function updateFiles(fileObject) {
    setFiles((files) => files.map((f) => f === fileObject ? fileObject : f));
  }

  const onFileChange = async (e) => {
    if (isClosed) {
      return;
    }

    const fileList: FileList = e.target.files;

    Array.from(fileList).forEach(async (file: Keyable) => {
      const size = file.size || 0;
      const fileObject: FileObject = {
        name: file.name,
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

      const signedResult = await callApiPost("signed-upload-url", {
        filename: file.name,
      });

      if (signedResult.failedRequest) {
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
        fileObject.filename = signedResult.filename;
      } else {
        fileObject.error = "file_upload_failed";
      }

      fileObject.loading = false;
      updateFiles(fileObject);
    });
  };

  function removeUpload(file: object) {
    setFiles(files.filter(f => f !== file));
  }

  return (
    <div className="sdk sdk-chat-page">
      <section className="message_box">
        {files.map((file: Keyable) => (
          <div className="attachment_file mb-0" key={file.name}>
            <div className={classNames("dots", { loading: file.loading })}>
              {file.name}
              {" "}
              {file.loading && i18n.t("MessageArea.processing_file")}
              {!isEmpty(file.error) && i18n.t(`MessageArea.${file.error}`)}
            </div>
            <div className="delete_file pointer" onClick={() => removeUpload(file)}>
              x
            </div>
          </div>
        ))}
        <div className="flex_grid">
          <div className="textfield">
            <textarea
              className="form-control dialog_text_area resize-ta"
              placeholder={i18n.t("MessageArea.message_placeholder")}
              value={message}
              onChange={handleChange}
              onKeyUp={handleKeys}
              style={{ height: textareaHeight, minHeight: "85px" }}
              disabled={isClosed}
            />
          </div>
          <div className="textfield_btn">
            <label
              htmlFor="fileUpload"
              className={`btn btn-secondary with-btn-lnf${
                isClosed ? " disabled" : ""
              }`}
            >
              {i18n.t("MessageArea.attach_file")}
              <input
                type="file"
                id="fileUpload"
                name="fileUpload"
                onChange={onFileChange}
                disabled={isClosed}
                hidden
                multiple
              />
            </label>
            <button
              className="btn btn-primary btn_outline float_right"
              onClick={onSubmit}
              disabled={isClosed || !message || filesError}
              type="button"
            >
              {i18n.t("MessageArea.submit")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default MessageArea;
