import React from "react";

function PageContentWrapper({ children }) {
  return (
    <div className="content_padding">
      <div className="page_content">{children}</div>
    </div>
  );
}
export default PageContentWrapper;
