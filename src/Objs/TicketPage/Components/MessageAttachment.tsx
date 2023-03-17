import React from "react";
import Modal from 'react-bootstrap/Modal';

import { isImageFormat } from "../../../utils/isImage";
import { matchExtension } from "../../../utils/fileExtension";
import ticketingUrl from "../../../api/ticketingUrl";

function MessageAttachment({ attachment }) {
  const [show, setShow] = React.useState(false);

  const isImage = isImageFormat(attachment.filename.split(".").pop());
  const downloadUrl = `${ticketingUrl()}/attachments/${attachment.key}`;
  const filename = decodeURIComponent(attachment.filename);
  const coverImage = isImage
    ? attachment.s3_url
    : matchExtension(attachment.filename.split(".").pop());

  return (
    <>
      <div className="img-attachment card" onClick={() => setShow(true)}>
        <a className="btn btn-download"
          href={downloadUrl}
          target="_blank"
          download
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fa fa-download" />
        </a>
        <div className="card-bkgrd-img" style={{ backgroundImage: `url(${coverImage})` }} title="attachment icon"></div>
        <div className="card-body">
          <div className="card-body-descr-container">
            <div className="card-body-descr-container">
              <p className="card-text dots">{filename}</p>
            </div>
          </div>
        </div>
      </div>

      {isImage && (
        <Modal show={show} fullscreen onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{filename}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="img-fluid" src={attachment.s3_url} />
          </Modal.Body>
          <Modal.Footer>
            <a className="btn btn-primary" href={downloadUrl} download>
              Download
            </a>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default MessageAttachment;
