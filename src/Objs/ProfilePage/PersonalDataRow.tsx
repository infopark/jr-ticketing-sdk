import React from "react";

function PersonalDataRow({ label, value }) {
  return (
    <dl className="d-flex flex-wrap table_style">
      <dt className="regular item_label">{label}</dt>
      <dd className="bold item_label_content">{value}</dd>
    </dl>
  );
}

export default PersonalDataRow;
