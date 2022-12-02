import React, { useState } from "react";
import classNames from "classnames";

import { callApiPost } from "../../../api/portalApiCalls";
import { MAX_ATTACHMENT_SIZE } from "../../../utils/constants";
import { useTenantContext } from "../../../Components/TenantContextProvider";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";
import i18n from "../../../config/i18n";

const MessageArea = ({ ticketId, refreshCallback, isClosed }) => {
  const { userId } = useTenantContext();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("" as any);
  const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(
    null
  );
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [attachmentTooBig, setAttachmentTooBig] = useState(false);

  const messageOrAttachment = message || file;

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeys = (e) => {
    if (e.keyCode === 13 || e.keyCode === 8) {
      const numberOfLineBreaks = (message.match(/\n/g) || []).length;
      const newHeight = 45 + numberOfLineBreaks * 20;
      setTextareaHeight(newHeight);
    }
  };

  const handleSendMessage = async (msg) => {
    if (!isClosed) {
      const msgData = {
        text: newlinesToBreaks(msg),
        ticket_id: ticketId,
        user_id: userId,
        attachments: [] as object[],
      };

      if (!!attachmentFileName) {
        msgData.attachments.push({
          filename: attachmentFileName
        });
      }

      callApiPost(`tickets/${ticketId}/messages`, msgData).then((response) => {
        setTextareaHeight(null);
        setFile("");
        setMessage("");
        setAttachmentFileName(null);
        if (!response.failedRequest) {
          refreshCallback();
        }
        return response;
      });
    }
  };

  const handleFileChange = async (e) => {
    if (!isClosed) {
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

      setFile(uploadFile);
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
      e.target.value = "";
    }
  };

  return (
    <div className="sdk sdk-chat-page">
      <section className="message_box">
        {file && (
          <div className="attachment_file">
            <div className={classNames("dots", { loading: attachmentLoading })}>
              {file.name}
              {attachmentLoading && " (processing)"}
              {attachmentLoading && <div className="bg" />}
            </div>
            <div className="delete_file pointer" onClick={() => setFile("")}>
              x
            </div>
          </div>
        )}
        <div className="flex_grid">
          <div className="textfield">
            <textarea
              className="form-control dialog_text_area resize-ta"
              placeholder={i18n.t("your message ...")}
              value={message}
              onChange={handleChange}
              onKeyUp={handleKeys}
              style={{ height: textareaHeight || "45px" }}
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
              {i18n.t("attach file")}
              <input
                type="file"
                id="fileUpload"
                name="fileUpload"
                onChange={(e) => handleFileChange(e)}
                hidden
                disabled={isClosed}
              />
            </label>
            <button
              className="btn btn-primary btn_outline float_right"
              onClick={() => handleSendMessage(message)}
              disabled={isClosed || attachmentLoading || attachmentTooBig || !messageOrAttachment}
              type="button"
            >
              {i18n.t("post message")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default MessageArea;
