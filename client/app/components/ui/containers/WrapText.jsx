import React from "react";

function WrapText() {
  return (
    <div className="w-96 bg-card rounded-md border p-4">
      <p className="manage_content_lines">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eos
        repellendus quae debitis, ipsum ipsam quaerat quod amet aperiam animi
        assumenda officia omnis in nihil molestias libero consequatur commodi
        officiis.
      </p>
      <input id="read_more" type="checkbox" />
      <label className="label" htmlFor="read_more">
        read more
      </label>
    </div>
  );
}

export default WrapText;
