import * as React from "react";
import CreateNewTicketOverlay from "./CreateNewTicketOverlay";

function CreateNewTicket({ className, chatPage, text }) {
  const [overlayOpen, setOverlayOpen] = React.useState(false);
  return (
    <div className={`${className} box space_box text_center`}>
      <div
        className="brand_bg radius equal_target h-100"
        onClick={() => {
          setOverlayOpen(true);
        }}
      >
        <span className="box d-block equal_target pointer">
          <i
            className="fa fa-plus custom_plus d-block m_auto"
            aria-hidden="true"
          />
          <span className="block">{text}</span>
        </span>
      </div>
      <CreateNewTicketOverlay
        isOpen={overlayOpen}
        close={() => {
          setOverlayOpen(false);
        }}
        chatPage={chatPage}
      />
    </div>
  );
}

export default CreateNewTicket;
