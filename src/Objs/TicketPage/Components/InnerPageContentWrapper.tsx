import React from "react";

function InnerPageContentWrapper({ children, additionalBoxClass }) {
  return (
    <div className={`wrapper_box ${additionalBoxClass}`}>
      <div className="row">
        <div className="col-lg-12">
          <div className="box">
            <div className="text_content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default InnerPageContentWrapper;
