import React from "react";

function ContentWrapper({ children }) {
  return (
    <div className="content_padding">
      <div className="page_content">
        <div className="box_bg_white wrapper_box crm_content">
          <div className="row">
            <div className="col-lg-12">
              <div className="box">
                <div className="text_content">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentWrapper;
