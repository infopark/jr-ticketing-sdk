import React from "react";
import TicketHeader from "./TicketHeader";
import TicketNav from "./TicketNav";

function CombinedTicketNav({
  ticket,
  mode,
  toggleMode,
  viewModes,
}) {
  return (
    <div className="scroll_header animate">
      <TicketHeader ticket={ticket} />
      <TicketNav mode={mode} toggleMode={toggleMode} viewModes={viewModes} />
    </div>
  );
}

export default CombinedTicketNav;
