import * as React from "react";
import * as Scrivito from "scrivito";

Scrivito.provideComponent("HeadlineWidget", (({ widget }) => {
  const style = widget.get("style") || "h2";
  const classNames: string[] = [];

  if (widget.get("showChapterNumber")) {
    const currentPage = widget.obj();
    const parentObj = widget.obj().parent();
    let chapterNumber = -1;

    if (parentObj && currentPage) {
      const childOrderIds = parentObj
        .get("childOrder")
        .map((item) => item.id());
      chapterNumber = childOrderIds.indexOf(currentPage.id());
    }
    if (chapterNumber !== -1) {
      classNames.push(`numbered-headline-${chapterNumber + 1}`);
    }
  }

  return (
    <Scrivito.WidgetTag className="box">
      <Scrivito.ContentTag
        tag={style}
        content={widget}
        attribute="headline"
        className={classNames.join(" ")}
      />
    </Scrivito.WidgetTag>
  );
}) as any);
