import React from "react";
import notificationIcon from "./assets/notification-icon.png";
import "./Notification.scss";

const formatNotificationDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function Notification({
  isOpen,
  onClose,
  notifications,
  isLoading,
  error,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div
        className="notification-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="notification-header">
          <h2 className="notification-title">Notifications</h2>
          <button
            type="button"
            className="notification-close"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className="notification-body">
          {isLoading ? <p className="notification-state">Loading...</p> : null}
          {!isLoading && error ? (
            <p className="notification-state notification-error">{error}</p>
          ) : null}
          {!isLoading && !error && notifications.length === 0 ? (
            <p className="notification-state">No notifications found.</p>
          ) : null}

          {!isLoading && !error
            ? notifications.map((item, index) => (
                <div className="notification-item" key={item.id || index}>
                  <div className="notification-item-top">
                    <div className="notification-copy">
                      <img
                        src={notificationIcon}
                        alt="Notification"
                        className="notification-item-icon"
                      />
                      <div>
                        <h3 className="notification-item-title">
                          {item.title || "Notification"}
                        </h3>
                        <p className="notification-item-message">
                          {item.message || "No message available"}
                        </p>
                      </div>
                    </div>
                    <p className="notification-item-date">
                      {formatNotificationDate(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
