import React from "react";

const TabComponentItem = ({ content, isHTML = false }) => {
  return (
    <div className="border border-second min-h-[150px] px-10 py-5">
      {isHTML ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default TabComponentItem;
