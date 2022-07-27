import React from "react";
import * as Scrivito from "scrivito";
import { getVisitedPages } from "../../utils/visitedPages";
import HistoryListEntry from "./HistoryListEntry";

Scrivito.provideComponent("HistoryWidget", (({ widget }) => {
  const currentPage = Scrivito.currentPage();
  const links = widget.get("links");
  const visitedPagesString = getVisitedPages(currentPage);
  const visitedPages = JSON.parse(visitedPagesString as any);
  const headline = visitedPages.length ? "headline" : "initialHeadline";
  return (
    <Scrivito.WidgetTag className="row sdk">
      <div className="col-lg-12 box space_box">
        <div className="box_bg_white">
          <header className="box_header">
            <Scrivito.ContentTag
              content={widget}
              attribute={headline}
              tag="h3"
            />
          </header>
          <ul className="icon_list">
            {visitedPages.length
              ? visitedPages &&
                visitedPages.map((obj, index) => {
                  const { url, title, pageType, query } = obj;
                  const link = new Scrivito.Link({
                    url,
                    title,
                  });
                  if (!query && pageType === "ChatPage") {
                    return null;
                  }
                  return (
                    <HistoryListEntry
                      key={`hk_${index}`}
                      link={link}
                      title={title}
                      pageType={pageType}
                      query={query}
                    />
                  );
                })
              : links &&
                links.map((link, index) => (
                  <HistoryListEntry
                    key={`hk_${index}`}
                    link={link}
                    title={link && link.get("title")}
                    pageType={link && link.objClass()}
                  />
                ))}
          </ul>
        </div>
      </div>
    </Scrivito.WidgetTag>
  );
}) as any);
