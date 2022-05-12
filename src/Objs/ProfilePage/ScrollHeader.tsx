import React from "react";

function ScrollHeader({ onClick, buttonText }) {
  return (
    <div className="scroll_header animate">
      <div className="ticket_info">
        <div className="row">
          <div className="col-lg-12 content_padding">
            <span className="wrapper_info_content no_wrap">
              <span className="info_item link pointer" onClick={onClick}>
                {buttonText}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollHeader;
