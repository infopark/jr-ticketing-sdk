import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash-es";

import TicketingApi from "../../../api/TicketingApi";
import { MAX_ATTACHMENT_SIZE } from "../../../utils/constants";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import i18n from "../../../config/i18n";
import { FileObject, Keyable } from "../../../utils/types";

const MessageArea = ({ ticketId, refreshCallback, isClosed, onScrollLast }) => {
  const { userId } = useTenantContext();
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileObject[]>([]);
  const [textareaHeight, setTextareaHeight] = useState<number>(85);
  const [showScroller, setShowScroller] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollMax = window.document.body.scrollHeight - window.document.body.offsetHeight;
      setShowScroller(window.scrollY + window.document.body.scrollTop < scrollMax);
    };

    window.addEventListener("resize", scrollHandler);
    window.addEventListener("scroll", scrollHandler);
    window.document.body.addEventListener("scroll", scrollHandler);
    scrollHandler();

    return () => {
      window.removeEventListener("resize", scrollHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.document.body.removeEventListener("scroll", scrollHandler);
    }
  }, []);

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

    const response = await TicketingApi.post(`tickets/${ticketId}/messages`, { data: msgData });

    setTextareaHeight(85);
    setFiles([]);
    setMessage("");

    if (!response.failedRequest) {
      refreshCallback();
    }
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

      const signedResult = await TicketingApi.post("signed-upload-url", {
        data: {
          filename: file.name,
        }
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
    <section className="message_box">
      {showScroller && (
        <div className="position-absolute-center-btn-wrapper">
          <button className="btn btn-secondary" type="button" onClick={() => onScrollLast()}>
            <i className="fa-solid fa-arrow-down pe-2" />
            {i18n.t("MessageArea.go_to_last_message")}
          </button>
        </div>
      )}

      <div className="flex_grid">
        <div className="textfield">
          <textarea className="form-control dialog_text_area resize-ta"
            placeholder={i18n.t("MessageArea.message_placeholder")}
            value={message}
            onChange={handleChange}
            onKeyUp={handleKeys}
            style={{ height: textareaHeight, minHeight: "85px" }}
          />

          {files.map((file: Keyable, index: number) => (
            <div className="file-loading-card" key={`${index}-${file.filename}`}>
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

                    {!isEmpty(file.error) && i18n.t(`MessageArea.${file.error}`)}
                  </div>
                  <button className="btn" type="button" aria-label="Delete" onClick={() => removeUpload(file)}>
                    <i className="fa-regular fa-circle-xmark" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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

          <button className="btn btn-primary float-lg-right"
            type="button"
            onClick={onSubmit}
            disabled={isClosed || !message || filesError}
          >
            {i18n.t("MessageArea.submit")}
          </button>
        </div>
      </div>
    </section>
  );
};
export default MessageArea;
