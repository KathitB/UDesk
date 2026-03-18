import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import priorityFlagIcon from "./assets/priority flag.svg";
import searchIcon from "./assets/search.svg";
import sidebarDashboardIcon from "./assets/sidebardashboard.png";
import sidebarNotificationIcon from "./assets/sidebarnotification.png";
import sidebarTicketsIcon from "./assets/sidebartickets.png";
import uDeskLogo from "./assets/UDeskLogo.svg";
import Notification from "./Notification";
import RaiseTicketPopUp from "./raiseTicketPopUp";
import "./Dashboard.scss";
import "./Tickets.scss";

export default function Tickets() {
  const navigate = useNavigate();
  const [isRaiseTicketOpen, setIsRaiseTicketOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [activeStatusTab, setActiveStatusTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ticketNumber");
  const [sortOrder, setSortOrder] = useState("asc");

  const notificationUrl =
    "https://apionboarding.uds.in/ticket/notification/?search=&page_size=10&page=1";

  useEffect(() => {
    if (!isNotificationOpen) {
      return undefined;
    }

    const controller = new AbortController();

    const fetchNotifications = async () => {
      try {
        setIsNotificationLoading(true);
        setNotificationError("");

        const response = await axios.get(notificationUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          signal: controller.signal,
        });

        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const mappedNotifications = list.map((item) => ({
          id: item.id,
          title: item.title || "Notification",
          message: item.body || "No message available",
          created_at: item.created_date,
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Notification API error:", error);
        setNotificationError(
          error.response?.data?.status?.message ||
            error.message ||
            "Failed to load notifications",
        );
      } finally {
        setIsNotificationLoading(false);
      }
    };

    fetchNotifications();

    return () => controller.abort();
  }, [isNotificationOpen, notificationUrl]);

  const tabs = ["All", "Open", "In Progress", "Review", "Resolved", "Reopened"];
  const ticketRows = [
    {
      ticketNumber: "1245",
      created: "23 / 04 / 2025",
      category: "Payroll And Compensation",
      subCategory: "Payslip Requests / Discrepancies",
      description: "Test",
      status: "In Progress",
      priority: "1",
    },
    {
      ticketNumber: "1243",
      created: "18 / 04 / 2025",
      category: "Billing",
      subCategory: "PO Number",
      description: "Po Number Mismatch",
      status: "Resolved",
      priority: "2",
    },
  ];

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(key);
    setSortOrder("asc");
  };

  const filteredRows = ticketRows
    .filter((row) => {
      const matchesTab =
        activeStatusTab === "All" || row.status === activeStatusTab;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.ticketNumber.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        row.subCategory.toLowerCase().includes(query) ||
        row.description.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    })
    .sort((firstRow, secondRow) => {
      const direction = sortOrder === "asc" ? 1 : -1;

      if (sortBy === "ticketNumber") {
        return (
          (Number(firstRow.ticketNumber) - Number(secondRow.ticketNumber)) *
          direction
        );
      }

      if (sortBy === "created") {
        const firstDate = new Date(
          firstRow.created
            .split("/")
            .map((item) => item.trim())
            .reverse()
            .join("-"),
        ).getTime();
        const secondDate = new Date(
          secondRow.created
            .split("/")
            .map((item) => item.trim())
            .reverse()
            .join("-"),
        ).getTime();

        return (firstDate - secondDate) * direction;
      }

      if (sortBy === "status") {
        return firstRow.status.localeCompare(secondRow.status) * direction;
      }

      if (sortBy === "priority") {
        return firstRow.priority.localeCompare(secondRow.priority) * direction;
      }

      return 0;
    });

  const getSortArrow = (key) => {
    if (sortBy !== key) {
      return "🔽";
    }

    return sortOrder === "asc" ? "🔼" : "🔽";
  };

  return (
    <div className="dashboard-page">
      <aside className="left-container-sidebar">
        <div className="brand-box">
          <img src={uDeskLogo} alt="UDesk" className="sidebar-logo-image" />
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <span className="menu-icon">
              <img
                src={sidebarDashboardIcon}
                alt="Dashboard"
                className="menu-icon-image"
              />
            </span>
            Dashboard
          </li>
          <li className="active-link">
            <span className="menu-icon">
              <img
                src={sidebarTicketsIcon}
                alt="Tickets"
                className="menu-icon-image"
              />
            </span>
            Tickets
          </li>
          <li onClick={() => setIsNotificationOpen(true)}>
            <span className="menu-icon">
              <img
                src={sidebarNotificationIcon}
                alt="Notification"
                className="menu-icon-image"
              />
            </span>
            Notification
          </li>
        </ul>

        <div className="company-card">
          <div className="company-logo">C</div>
          <div>
            <p>Codoid Innovation</p>
            <span>Private Limited</span>
          </div>
        </div>
      </aside>

      <div className="right-container">
        <div className="breadcrumb">
          <p>Tickets</p>
          <button type="button" onClick={() => setIsRaiseTicketOpen(true)}>
            Raise a Ticket ?
          </button>
        </div>

        <section className="tickets-shell card-box">
          <div className="tickets-toolbar">
            <div className="tickets-filter-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={
                    activeStatusTab === tab
                      ? "tickets-filter-tab is-active"
                      : "tickets-filter-tab"
                  }
                  onClick={() => setActiveStatusTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tickets-search">
              <img
                src={searchIcon}
                alt="Search"
                className="tickets-search-icon-image"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="tickets-table-wrap">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    <button
                      type="button"
                      className="tickets-sort-button"
                      onClick={() => handleSort("ticketNumber")}
                    >
                      Ticket Number
                      <span className="tickets-sort-arrow">
                        {getSortArrow("ticketNumber")}
                      </span>
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      className="tickets-sort-button"
                      onClick={() => handleSort("created")}
                    >
                      Created
                      <span className="tickets-sort-arrow">
                        {getSortArrow("created")}
                      </span>
                    </button>
                  </th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Description</th>
                  <th>
                    <button
                      type="button"
                      className="tickets-sort-button"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <span className="tickets-sort-arrow">
                        {getSortArrow("status")}
                      </span>
                    </button>
                  </th>
                  <th>
                    <button
                      type="button"
                      className="tickets-sort-button"
                      onClick={() => handleSort("priority")}
                    >
                      Priority
                      <span className="tickets-sort-arrow">
                        {getSortArrow("priority")}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.ticketNumber}>
                    <td>{row.ticketNumber}</td>
                    <td>{row.created}</td>
                    <td>{row.category}</td>
                    <td>{row.subCategory}</td>
                    <td>{row.description}</td>
                    <td>
                      <span
                        className={
                          row.status === "Resolved"
                            ? "tickets-status-badge is-resolved"
                            : "tickets-status-badge is-progress"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="tickets-priority-cell">
                      <img
                        src={priorityFlagIcon}
                        alt="Priority"
                        className="tickets-priority-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRows.length === 0 ? (
              <p className="dashboard-empty">No tickets found.</p>
            ) : null}
          </div>
        </section>
      </div>

      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        isLoading={isNotificationLoading}
        error={notificationError}
      />

      <RaiseTicketPopUp
        isOpen={isRaiseTicketOpen}
        onClose={() => setIsRaiseTicketOpen(false)}
      />
    </div>
  );
}
