import * as React from "react";
import * as Scrivito from "scrivito";

Scrivito.provideComponent("SectionWidget", (({ widget }) => (
  <Scrivito.WidgetTag className="box_bg_white wrapper_box content_section">
    <div className="row">
      <Scrivito.ContentTag
        className="col-lg-12"
        content={widget}
        attribute="content"
        widgetProps={{ insideSection: true }}
      />
    </div>
  </Scrivito.WidgetTag>
)) as any);
