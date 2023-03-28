import React from "react";
import * as Scrivito from "scrivito";

function TicketNumberBox({ number, link, className, todoBox, text }) {
  return (
    <div className={`${className} box space_box text_center ticket-number-box`}>
      <div className="box_bg_white equal_target h-100">
        <Scrivito.LinkTag to={link} className="box d-block equal_target">
          <span className="h1 brand_color d-block ticket-number-box-count">
            {number}
          </span>
          <span className="block">{text}</span>
          {todoBox && <span className="todo_dot"></span>}
        </Scrivito.LinkTag>
      </div>
    </div>
  );
}
export default TicketNumberBox;
