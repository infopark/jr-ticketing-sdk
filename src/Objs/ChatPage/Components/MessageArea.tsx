import React, { useState } from "react";
import classNames from "classnames";
import { callApiPost } from "../../../api/portalApiCalls";
import { CDN_BASE_PATH } from "../../../utils/constants";
import { useUserData } from "../../../Components/UserDataContext";
import { translate } from "../../../utils/translate";
import newlinesToBreaks from "../../../utils/newlinesToBreaks";

const MessageArea = ({ ticketId, refreshCallback, isClosed }) => {
  const { userData } = useUserData();
  const userId = userData && userData.userid;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("" as any);
  const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

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

  const handleSendMessage = async (msg, id, usr) => {
    if (!isClosed) {
      const msgTextData = {
        text: newlinesToBreaks(msg),
        ticketId: id,
        userId: usr,
      };
      const attachmentData = attachmentFileName
        ? await callApiPost("create-cdn-object", {
            path: `attachments/${ticketId}/${attachmentFileName}`,
            uuid: ticketId,
            objectType: "attachment",
          }).then((response) => {
            if (response.failedRequest) {
              return;
            }
            return response;
          })
        : null;

      const msgData = {
        ...msgTextData,
        attachment: attachmentData
          ? `${CDN_BASE_PATH}/${attachmentData.objectPath}`
          : null,
      };

      callApiPost("create-ticketmessage", msgData).then((response) => {
        setTextareaHeight(null);
        setFile("");
        setMessage("");
        setAttachmentFileName(null);
        if (response.status === "ticketMessageCreated") {
          refreshCallback();
        }
        return response;
      });
    }
  };

  const handleFileChange = async (e) => {
    if (!isClosed) {
      const uploadFile = e.target.files[0];
      setFile(uploadFile);
      setAttachmentLoading(true);
      callApiPost("get-signed-upload-url", {
        fileName: `attachments/${ticketId}/${uploadFile.name}`,
      }).then(async (response) => {
        if (response.failedRequest) {
          setAttachmentLoading(false);
          return;
        }
        await fetch(response.uploadUrl, {
          method: "PUT",
          body: uploadFile,
        });
        setAttachmentFileName(`${uploadFile.name}`);
        setAttachmentLoading(false);
      });
      e.target.value = "";
    }
  };

  return (
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
            placeholder={translate("your message ...")}
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
            {translate("attach file")}
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
            onClick={() => handleSendMessage(message, ticketId, userId)}
            disabled={isClosed || attachmentLoading || !messageOrAttachment}
            type="button"
          >
            {translate("post message")}
          </button>
        </div>
      </div>
    </section>
  );
};
export default MessageArea;
