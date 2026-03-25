import React from "react";
import asPerCorporateIcon from "../assets/aspercorporate.svg";
import declineIcon from "../assets/decline.svg";
import growthIcon from "../assets/growth.svg";
import "./WorkflowActionPopUp.scss";

function PopupBusinessValue({ value, trend }) {
  return (
    <div className="workflow-action-popup-value-wrap">
      <span>{value}</span>
      {trend ? (
        <img
          src={trend === "down" ? declineIcon : growthIcon}
          alt={trend === "down" ? "Decline" : "Growth"}
          className="workflow-action-popup-trend-icon"
        />
      ) : null}
    </div>
  );
}

export default function WorkflowActionPopUp({
  isOpen,
  onClose,
  title,
  summaryCards,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="workflow-action-popup-overlay" onClick={onClose}>
      <div
        className="workflow-action-popup-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="workflow-action-popup-topline" />

        <div className="workflow-action-popup-header">
          <h2 className="workflow-action-popup-title">{title}</h2>
          <button
            type="button"
            className="workflow-action-popup-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            x
          </button>
        </div>

        <div className="workflow-action-popup-grid">
          {summaryCards.map((card) => (
            <section
              key={card.title}
              className={`workflow-action-popup-card ${card.accentClass}`}
            >
              <div className="workflow-action-popup-card-header">
                <div className="workflow-action-popup-card-icon">
                  <img
                    src={asPerCorporateIcon}
                    alt=""
                    className="workflow-action-popup-card-icon-image"
                  />
                </div>
                <h4 className="workflow-action-popup-card-title">
                  {card.title}
                </h4>
              </div>

              <div className="workflow-action-popup-card-body">
                {card.rows.map((row) => (
                  <div
                    key={row.label}
                    className="workflow-action-popup-card-row"
                  >
                    <span className="workflow-action-popup-card-label">
                      {row.label}
                    </span>
                    <span
                      className={`workflow-action-popup-card-value ${row.valueClass || ""}`}
                    >
                      {row.label === "Business Value" ? (
                        <PopupBusinessValue
                          value={row.value}
                          trend={row.trend}
                        />
                      ) : (
                        row.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
