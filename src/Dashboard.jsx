import axios from "axios";
import React, { useEffect, useState } from "react";
import callButtonIcon from "./assets/callbutton.svg";
import inProgressIcon from "./assets/inprogress.png";
import openTicketsIcon from "./assets/opentickets.png";
import payslipIcon from "./assets/payslip.png";
import reopenedTicketsIcon from "./assets/reopenedtickets.png";
import resolvedTicketsIcon from "./assets/resolvedtickets.png";
import reviewTicketsIcon from "./assets/reviewtickets.png";
import sidebarDashboardIcon from "./assets/sidebardashboard.png";
import sidebarNotificationIcon from "./assets/sidebarnotification.png";
import sidebarTicketsIcon from "./assets/sidebartickets.png";
import uDeskLogo from "./assets/UDeskLogo.svg";
import Notification from "./Notification";
import RaiseTicketPopUp from "./raiseTicketPopUp";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const getTicketStatusLabel = (status) => {
  switch (String(status)) {
    case "0":
      return "Open";
    case "1":
      return "In Progress";
    case "2":
      return "Review";
    case "3":
      return "Resolved";
    case "4":
      return "Reopened";
    default:
      return "Open";
  }
};

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isRaiseTicketOpen, setIsRaiseTicketOpen] = useState(false);

  const dashboard_url =
    "https://apionboarding.uds.in/ticketapp/clientdashboard/";
  const notificationUrl =
    "https://apionboarding.uds.in/ticket/notification/?search=&page_size=10&page=1";

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      try {
        setDashboardError("");

        const response = await axios.get(dashboard_url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          signal: controller.signal,
        });

        setDashboardData(response.data);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Dashboard API error:", error);
        setDashboardError(
          error.response?.data?.status?.message ||
            error.message ||
            "Failed to load dashboard data",
        );
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, [dashboard_url]);

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

        const responseData = response.data;
        const list = Array.isArray(responseData?.data) ? responseData.data : [];

        const mappedNotifications = list.map((item) => ({
          id: item.id,
          title: item.title || "Notification",
          message: item.body || "No message available",
          created_at: item.created_date,
          viewed: item.viewed,
          notificationType: item.notification_type,
          ticketId: item.client_ticket_id,
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

  const defaultGridContent = [
    {
      type: "Open Tickets",
      score: "0",
      color: "orange-card",
      icon: openTicketsIcon,
    },
    {
      type: "In Progress Tickets",
      score: "1",
      color: "yellow-card",
      icon: inProgressIcon,
    },
    {
      type: "Review Tickets",
      score: "0",
      color: "teal-card",
      icon: reviewTicketsIcon,
    },
    {
      type: "Reopened Tickets",
      score: "0",
      color: "red-card",
      icon: reopenedTicketsIcon,
    },
    {
      type: "Resolved Tickets",
      score: "1",
      color: "green-card",
      icon: resolvedTicketsIcon,
    },
  ];

  const apiData = dashboardData?.data;
  const recentTicket = apiData?.recent_ticket;
  const recentTicketStatus = getTicketStatusLabel(recentTicket?.status);
  const companyName =
    recentTicket?.client_id?.client_name || "Codoid Innovation Private Limited";
  const companyInitial = companyName.charAt(0).toUpperCase();

  const defaultTickets = [
    {
      id: 1,
      title: "Payslip request issue",
      created: "Apr 23, 2025",
      status: "In Progress",
      tag: "Overdue",
      category: "Open",
    },
    {
      id: 2,
      title: "PO number update",
      created: "Apr 18, 2025",
      status: "Resolved",
      tag: "finished",
      category: "Resolved",
    },
  ];

  const defaultContacts = [
    {
      name: "Ramkumar",
      role: "Regional Manager",
      color: "contact-yellow",
      phone: "8940996408",
    },
    {
      name: "Test User",
      role: "Manager Logistic",
      color: "contact-green",
      phone: "8939442211",
    },
    {
      name: "Asiq",
      role: "Manager",
      color: "contact-orange",
      phone: "8754321098",
    },
  ];

  const tabs = ["All", "Open", "In Progress", "Review", "Resolved"];
  const gridContent = apiData
    ? [
        {
          type: "Open Tickets",
          score: String(apiData.open_ticketing_count ?? 0),
          color: "orange-card",
          icon: openTicketsIcon,
        },
        {
          type: "In Progress Tickets",
          score: String(apiData.inprocess_ticketing_count ?? 0),
          color: "yellow-card",
          icon: inProgressIcon,
        },
        {
          type: "Review Tickets",
          score: String(apiData.review_ticketing_count ?? 0),
          color: "teal-card",
          icon: reviewTicketsIcon,
        },
        {
          type: "Reopened Tickets",
          score: String(apiData.reopen_ticketing_count ?? 0),
          color: "red-card",
          icon: reopenedTicketsIcon,
        },
        {
          type: "Resolved Tickets",
          score: String(apiData.close_ticketing_count ?? 0),
          color: "green-card",
          icon: resolvedTicketsIcon,
        },
      ]
    : defaultGridContent;
  const tickets = recentTicket
    ? [
        {
          id: recentTicket.id,
          title:
            recentTicket.clientsub_category_id?.issue_category?.name ||
            recentTicket.clientsub_category_id?.name ||
            `Ticket #${recentTicket.ticket_number}`,
          created: formatDate(recentTicket.created_at),
          status: recentTicketStatus,
          tag: recentTicket.over_due ? "Overdue" : "On Time",
          category: recentTicketStatus,
          ticketNumber: recentTicket.ticket_number,
        },
      ]
    : defaultTickets;
  const contacts =
    dashboardData?.contacts?.length > 0
      ? dashboardData.contacts
      : defaultContacts;

  const filteredTickets =
    activeTab === "All"
      ? tickets
      : tickets.filter(
          (ticket) =>
            ticket.category === activeTab || ticket.status === activeTab,
        );

  return (
    <div className="dashboard-page">
      <aside className="left-container-sidebar">
        <div className="brand-box">
          <img src={uDeskLogo} alt="UDesk" className="sidebar-logo-image" />
        </div>

        <ul className="sidebar-menu">
          <li className="active-link" onClick={() => navigate("/dashboard")}>
            <span className="menu-icon">
              <img
                src={sidebarDashboardIcon}
                alt="Dashboard"
                className="menu-icon-image"
              />
            </span>
            Dashboard
          </li>
          <li onClick={() => navigate("/tickets")}>
            <span className="menu-icon">
              <img
                src={sidebarTicketsIcon}
                alt="Tickets"
                className="menu-icon-image"
              />
            </span>
            Tickets
          </li>
          <li
            className=""
            onClick={() => {
              setIsNotificationOpen(true);
            }}
          >
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
          <div className="company-logo">{companyInitial}</div>
          <div>
            <p>{companyName}</p>
            <span>Client Dashboard</span>
          </div>
        </div>
      </aside>

      <div className="right-container">
        <div className="breadcrumb">
          <p>Dashboard</p>
          <button type="button" onClick={() => setIsRaiseTicketOpen(true)}>
            Raise a Ticket ?
          </button>
        </div>

        {dashboardError && <p className="dashboard-error">{dashboardError}</p>}

        <div className="stats-grid">
          {gridContent.map((grid, index) => (
            <div className="stat-card" key={index}>
              <div className={`stat-icon ${grid.color}`}>
                <img
                  src={grid.icon}
                  alt={grid.type}
                  className="stat-icon-image"
                />
              </div>
              <div className="stat-text">
                <h3>{grid.score}</h3>
                <p>{grid.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-grid">
          <section className="ticket-summary card-box">
            <div className="section-head">
              <h2>Ticket Summary</h2>
              <button type="button">View all</button>
            </div>

            <div className="tabs-row">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={activeTab === tab ? "tab active-tab" : "tab"}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="ticket-list">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div className="ticket-item" key={ticket.id}>
                    <div className="ticket-left">
                      <div className="ticket-square">
                        <img
                          src={payslipIcon}
                          alt="Payslip"
                          className="ticket-square-image"
                        />
                      </div>
                      <div>
                        <h4>{ticket.title}</h4>
                        <p>
                          Ticket #{ticket.ticketNumber || ticket.id} • Created:{" "}
                          {ticket.created}
                        </p>
                      </div>
                    </div>

                    <div className="ticket-right">
                      <span
                        className={`status-pill ${ticket.status.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {ticket.status}
                      </span>
                      <span className="small-tag">{ticket.tag}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboard-empty">No tickets available.</p>
              )}
            </div>
          </section>

          <div className="side-widgets">
            <section className="card-box">
              <div className="section-head simple-head">
                <h2>Recent Ticket Status</h2>
              </div>

              <div className="mini-ticket">
                <div className="ticket-left">
                  <div className="ticket-square">
                    <img
                      src={payslipIcon}
                      alt="Payslip"
                      className="ticket-square-image"
                    />
                  </div>
                  <div>
                    <h4>{tickets[0]?.title || "No recent ticket available"}</h4>
                    <p>Created: {tickets[0]?.created || "N/A"}</p>
                  </div>
                </div>

                <div className="ticket-right">
                  <span
                    className={`status-pill ${String(
                      tickets[0]?.status || "Open",
                    )
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {tickets[0]?.status || "Open"}
                  </span>
                  <span className="small-tag">{tickets[0]?.tag || "N/A"}</span>
                </div>
              </div>
            </section>

            <section className="card-box">
              <div className="section-head simple-head">
                <h2>Your UDS Contacts</h2>
              </div>

              <div className="contact-list">
                {contacts.map((contact, index) => (
                  <div className="contact-row" key={index}>
                    <div className="contact-left">
                      <div className={`contact-avatar ${contact.color}`}>
                        {contact.name[0]}
                      </div>
                      <div>
                        <h4>{contact.name}</h4>
                        <p>{contact.role}</p>
                      </div>
                    </div>

                    <div className="call-btn-wrap">
                      <span className="call-tooltip">
                        {contact.phone || "No number"}
                      </span>
                      <button type="button" className="call-btn">
                        <img
                          src={callButtonIcon}
                          alt="Call"
                          className="call-btn-image"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
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
