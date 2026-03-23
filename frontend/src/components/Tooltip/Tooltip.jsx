import React from "react";
import ReactDOM from "react-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import styles from "./Tooltip.module.scss";

const domNode = document.createElement("div");
domNode.className = styles.tooltipDiv;
document.body.appendChild(domNode);

// Wrapper component to portal react-tooltips
function BodyPortal({ children }) {
  return ReactDOM.createPortal(children, domNode);
}
const Tooltip = ({ maxLength = 15, data = "", children, id, maxWidth }) => {
  const strId = typeof id === "string" ? id : id?.toString?.();
  if (maxLength && (data?.length || 0) <= maxLength) {
    return children || data || "";
  } else {
    return (
      <>
        <BodyPortal>
          <ReactTooltip
            id={strId}
            classNameArrow="arrow"
            // arrowColor="red"
            // className={styles.tooltip}
            style={{
              position: "fixed",
              zIndex: 9,
              maxWidth: maxWidth || "250px",
            }}
            delayHide={100}
            // float={true}
            clickable={true}
          />
        </BodyPortal>
        <a
          className={styles.anchorTag}
          data-tooltip-id={strId}
          data-tooltip-html={`<div class=${styles.tooltip}><p>${data}</p></div>`}
        >
          {children || data?.slice(0, maxLength - 2) + "..."}
        </a>
      </>
    );
  }
};

export default Tooltip;
