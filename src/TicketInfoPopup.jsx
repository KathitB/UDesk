import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import callButtonIcon from "./assets/callbutton.svg";
import ticketPopupIcon from "./assets/ticketpopupticketicon.svg";
import ticketPopupBackground from "./assets/ticketspopupbg.svg";
import "./TicketInfoPopup.scss";

const TRACKING_STAGES = [
  { key: "open", label: "Open" },
  { key: "inprogress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "resolved", label: "Resolved" },
];

const TIMELINE_STAGE_MAP = {
  open: "open",
  inprogress: "inprogress",
  completed: "review",
  close: "resolved",
};

const formatStatusLabel = (value) => {
  if (!value) {
    return "--";
  }

  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function TicketInfoPopup({ isOpen, onClose, ticket }) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsDetailsExpanded(true);
    }
  }, [isOpen, ticket]);

  useEffect(() => {
    if (!isOpen || !ticket?.ticketId) {
      setTimelineData(null);
      return undefined;
    }

    const controller = new AbortController();

    const fetchTicketTimeline = async () => {
      try {
        const response = await axios.get(
          "https://apionboarding.uds.in/ticketapp/tickettimeline/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            params: {
              ticket_id: ticket.ticketId,
            },
            signal: controller.signal,
          },
        );

        setTimelineData(response.data?.data || null);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Ticket timeline API error:", error);
        setTimelineData(null);
      }
    };

    fetchTicketTimeline();

    return () => controller.abort();
  }, [isOpen, ticket]);

  const formatTrackingDate = (value) => {
    if (!value) {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTrackingTime = (value) => {
    if (!value) {
      return "--";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const trackingStages = useMemo(() => {
    const trackingSource = timelineData
      ? Object.entries(timelineData).reduce((accumulator, [apiKey, value]) => {
          const mappedKey = TIMELINE_STAGE_MAP[apiKey];

          if (mappedKey) {
            accumulator[mappedKey] = {
              date: formatTrackingDate(value?.created_date),
              time: formatTrackingTime(value?.created_date),
              completed: Boolean(value?.created_date),
            };
          }

          return accumulator;
        }, {})
      : null;

    if (trackingSource) {
      return TRACKING_STAGES.map((stage) => ({
        ...stage,
        date: trackingSource[stage.key]?.date || "--",
        time: trackingSource[stage.key]?.time || "--",
        completed: Boolean(trackingSource[stage.key]?.completed),
      }));
    }

    if (ticket?.tracking?.length) {
      return TRACKING_STAGES.map((stage) => {
        const matchedStage = ticket.tracking.find(
          (item) => item.key === stage.key,
        );
        return {
          ...stage,
          date: matchedStage?.date || "--",
          time: matchedStage?.time || "--",
          completed: Boolean(matchedStage?.completed),
        };
      });
    }

    return TRACKING_STAGES.map((stage) => ({
      ...stage,
      date: "--",
      time: "--",
      completed: false,
    }));
  }, [ticket, timelineData]);

  if (!isOpen || !ticket) {
    return null;
  }

  return (
    <div className="ticket-info-overlay" onClick={onClose}>
      <div
        className="ticket-info-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="ticket-info-close" onClick={onClose}>
          x
        </button>

        <div className="ticket-info-layout">
          <aside className="ticket-info-sidebar">
            <h2 className="ticket-info-title">Progress Update</h2>

            <div className="ticket-info-illustration">
              <img
                src={ticketPopupBackground}
                alt="Ticket progress update"
                className="ticket-info-illustration-image"
              />
            </div>
          </aside>

          <section className="ticket-info-content">
            <div className="ticket-info-scroll-area">
              <div className="ticket-info-summary">
                <div className="ticket-info-summary-top">
                  <div className="ticket-info-summary-icon-wrap">
                    <img
                      src={ticketPopupIcon}
                      alt="Ticket"
                      className="ticket-info-summary-icon"
                    />
                  </div>

                  <div className="ticket-info-summary-item">
                    <span className="ticket-info-summary-label">
                      Ticket Number
                    </span>
                    <strong>{ticket.ticketNumber}</strong>
                  </div>

                  <div className="ticket-info-summary-item">
                    <span className="ticket-info-summary-label">
                      Created Date
                    </span>
                    <strong>{ticket.created}</strong>
                  </div>

                  <div className="ticket-info-summary-item">
                    <span className="ticket-info-summary-label">
                      Resolved Date
                    </span>
                    <strong>{ticket.resolvedDate || "--"}</strong>
                  </div>

                  <div className="ticket-info-summary-item">
                    <span className="ticket-info-summary-label">Status</span>
                    <strong className="ticket-info-status">
                      {formatStatusLabel(ticket.status)}
                    </strong>
                  </div>

                  <div className="ticket-info-summary-item">
                    <span className="ticket-info-summary-label">Priority</span>
                    <strong className="ticket-info-priority">
                      {ticket.priorityLabel}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="ticket-info-panel">
                <button
                  type="button"
                  className="ticket-info-accordion-toggle"
                  onClick={() =>
                    setIsDetailsExpanded((currentValue) => !currentValue)
                  }
                >
                  <span>Ticket Details</span>
                  <span
                    className={`ticket-info-accordion-arrow ${
                      isDetailsExpanded ? "is-expanded" : ""
                    }`}
                  >
                    ^
                  </span>
                </button>

                {isDetailsExpanded ? (
                  <div className="ticket-info-details-body">
                    <div className="ticket-info-detail-row">
                      <span className="ticket-info-detail-label">
                        Issue Category
                      </span>
                      <span className="ticket-info-detail-value">
                        {ticket.category}
                      </span>
                    </div>
                    <div className="ticket-info-detail-row">
                      <span className="ticket-info-detail-label">
                        Sub Category
                      </span>
                      <span className="ticket-info-detail-value">
                        {ticket.subCategory}
                      </span>
                    </div>
                    <div className="ticket-info-detail-row">
                      <span className="ticket-info-detail-label">
                        Description
                      </span>
                      <span className="ticket-info-detail-value">
                        {ticket.description}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="ticket-info-block">
                <div className="ticket-info-tab">Assignee</div>

                <div className="ticket-info-assignee-card">
                  <div className="ticket-info-assignee-details">
                    <span className="ticket-info-assignee-avatar"> </span>
                    <span className="ticket-info-assignee-name">
                      {ticket.assignee || "--"}
                    </span>
                  </div>

                  <div className="ticket-info-call-wrap">
                    <span className="ticket-info-call-tooltip">
                      {ticket.phone || "No number"}
                    </span>
                    <button type="button" className="ticket-info-call-button">
                      <img src={callButtonIcon} alt="Call assignee" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="ticket-info-block">
                <div className="ticket-info-tab">Tracking</div>

                <div className="ticket-info-tracking-card">
                  <div className="ticket-info-overdue-badge">
                    {ticket.slaStatus}
                  </div>

                  <div className="ticket-info-tracking-scroll">
                    {trackingStages.map((stage) => (
                      <div
                        key={stage.key}
                        className="ticket-info-tracking-stage"
                      >
                        <div className="ticket-info-tracking-head">
                          <span
                            className={`ticket-info-tracking-dot ${
                              stage.completed ? "is-complete" : ""
                            }`}
                          />
                          <span className="ticket-info-tracking-label">
                            {stage.label}
                          </span>
                        </div>

                        <div
                          className={`ticket-info-tracking-line ${
                            stage.completed ? "is-complete" : ""
                          }`}
                        />

                        <div className="ticket-info-tracking-meta">
                          <span>{stage.date}</span>
                          <span>{stage.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ticket-info-block">
                <div className="ticket-info-remarks-card">
                  <h3>Remarks</h3>
                  <p>{ticket.remarks || "--"}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
