import React from "react";
import CreateNewTicketOverlay from "./CreateNewTicketOverlay";

function CreateNewTicket({ className, ticketPage, text, ticketUiSchema }) {
  const [overlayOpen, setOverlayOpen] = React.useState<boolean>(false);

  return (
    <div className={`${className} box space_box text_center`}>
      <div
        className="box_bg_white radius equal_target h-100"
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
        ticketPage={ticketPage}
        ticketUiSchema={ticketUiSchema}
      />
    </div>
  );
}

export default CreateNewTicket;
