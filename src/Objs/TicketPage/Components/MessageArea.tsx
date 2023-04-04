import React from "react";
import { isEmpty } from "lodash-es";

import TicketingApi from "../../../api/TicketingApi";
import { MAX_ATTACHMENT_SIZE } from "../../../utils/constants";
import { useTicketingContext } from "../../../Components/TicketingContextProvider";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import i18n from "../../../config/i18n";
import { FileObject, Keyable } from "../../../utils/types";

import AttachIcon from "../../../assets/images/icons/attach_icon.svg";
import SendIcon from "../../../assets/images/icons/send_icon.svg";

const MessageArea = ({ ticketId, refreshCallback, isClosed }) => {
  const { currentUser, addError } = useTicketingContext();
  const [message, setMessage] = React.useState("");
  const [files, setFiles] = React.useState<FileObject[]>([]);
  const [rows, setRows] = React.useState<number>(1);

  const filesError = files.some((f: Keyable) => !isEmpty(f.error));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const { paddingTop, paddingBottom, lineHeight } = getComputedStyle(e.target);

    const previousRows = e.target.rows;
    e.target.rows = 1;

		const currentRows = Math.floor((e.target.scrollHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)) / parseFloat(lineHeight));

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setRows(currentRows);
  };

  const onSubmit = async () => {
    try {
      if (isClosed) {
        return;
      }

      const attachments = files.reduce(
        (result: object[], file) => file.filename
          ? [...result, { filename: file.filename}]
          : result, []);

      const msgData = {
        text: newlinesToBreaks(message),
        user_id: currentUser?.id,
        attachments: attachments
      };

      const response = await TicketingApi.post(`tickets/${ticketId}/messages`, { data: msgData });

    setRows(1);
    setFiles([]);
    setMessage("");

      if (response) {
        refreshCallback();
      }
    } catch (error) {
      addError("Error submitting message", "MessageArea", error);
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
          fileObject.filename = signedResult.filename;
        } else {
          fileObject.error = "file_upload_failed";
        }

        fileObject.loading = false;
        updateFiles(fileObject);
      } catch (error) {
        addError("Error uploading file", "MessageArea", error);
      }
    });
  };

  function removeUpload(file: object) {
    setFiles(files.filter(f => f !== file));
  }

  return (
    <section className="message_box">
      {files.map((file: Keyable, index: number) => (
        <div className="file-loading-card" key={`${index}-${file.filename}`}>
          <div className="card">
            <div className="card-body">
              <div className="inline-nowrap-area">
                <i className="fa-regular fa-file pe-2"></i>
                <h5 className="card-title dots">
                  {decodeURIComponent(file.name)}
                </h5>

                <p className="card-text">
                  {Math.round(file.size / 1024)}KB
                </p>

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

      <div className="flex_grid">
        <div className="textfield_btn">
          <button className="btn btn-secondary" type="button">
            <label
              htmlFor="fileUpload"
              className={`btn btn-secondary m-0 p-0 with-btn-lnf${
                isClosed ? " disabled" : ""
              }`}
            >
              <img className="img-fluid" src={AttachIcon} />
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
          </button>
        </div>
        <div className="textfield">
          <textarea className="form-control dialog_text_area resize-ta"
            placeholder={i18n.t("MessageArea.message_placeholder")}
            value={message}
            onChange={handleChange}
            rows={rows}
          />
        </div>
        <div className="textfield_btn">
          <button className="btn btn-primary float-lg-right"
            type="button"
            disabled={isClosed || !message || filesError}
            onClick={onSubmit}
          >
            <img className="img-fluid" src={SendIcon} />
            <span className="d-none d-lg-inline-block">
              {i18n.t("MessageArea.submit")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
export default MessageArea;
