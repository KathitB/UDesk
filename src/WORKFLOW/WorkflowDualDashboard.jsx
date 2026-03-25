import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateRangePicker } from "@mui/x-date-pickers-pro/DesktopDateRangePicker";
import { SvgIcon } from "@mui/material";
import completedTileIcon from "../assets/completed.svg";
import manpowerTileIcon from "../assets/manpower.svg";
import mySitesTileIcon from "../assets/mysites.svg";
import pendingTileIcon from "../assets/pending.svg";
import searchIcon from "../assets/search.svg";
import blueBackground from "../assets/bluebackground.jpg";
import whiteBackground from "../assets/whiteBackground.png";
import "./workFlowDashBoard.scss";
import "./WorkflowDualDashboard.scss";

const FILTER_TABS = ["All", "Pending", "Completed"];
const DEMO_RANGE_START = "2026-03-01";
const DEMO_RANGE_END = "2026-03-25";

const RANGE_DEMO_DATA = {
  summary: {
    sites: 4,
    manpower: 82,
    pending: 2,
    completed: 2,
  },
  entities: [
    {
      id: "chemplast-me",
      name: "CHEMPLAST CUDDALORE VINYLS LTD CUDDALORE-ME",
      zone: "PONDY",
      status: "completed",
    },
    {
      id: "chemplast-wynwy",
      name: "CHEMPLAST CUDDALORE VINYLS LTD-CUDDALORE (WYNWY)",
      zone: "trichy",
      status: "completed",
    },

    {
      id: "ashok-leyland",
      name: "ASHOK LEYLAND TECH CENTER-PY-HK",
      zone: "trichy",
      status: "pending",
    },
    {
      id: "lucas-tvs",
      name: "LUCAS TVS LTD-PONDY-HK",
      zone: "PONDY",
      status: "pending",
    },
  ],
};

function DownloadIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M11 4h2v7.17l2.59-2.58L17 10l-5 5-5-5 1.41-1.41L11 11.17zM5 18h14v2H5z" />
    </SvgIcon>
  );
}

function ChevronRightIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m9.29 6.71 1.42-1.42L17.41 12l-6.7 6.71-1.42-1.42L14.59 12z" />
    </SvgIcon>
  );
}

function getDashboardData(dateRange) {
  if (!dateRange?.[0] || !dateRange?.[1]) {
    return {
      summary: {
        sites: 0,
        manpower: 0,
        pending: 0,
        completed: 0,
      },
      entities: [],
    };
  }

  const start = dateRange[0].format("YYYY-MM-DD");
  const end = dateRange[1].format("YYYY-MM-DD");

  if (start === DEMO_RANGE_START && end === DEMO_RANGE_END) {
    return RANGE_DEMO_DATA;
  }

  return {
    summary: {
      sites: 0,
      manpower: 0,
      pending: 0,
      completed: 0,
    },
    entities: [],
  };
}

export default function WorkflowDualDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs("2026-03-01"),
    dayjs("2026-03-25"),
  ]);

  const dashboardData = useMemo(() => getDashboardData(dateRange), [dateRange]);
  const summaryCards = useMemo(
    () => [
      {
        title: "My Sites",
        value: dashboardData.summary.sites,
        variant: "primary",
        icon: mySitesTileIcon,
        backgroundImage: blueBackground,
      },
      {
        title: "Total Manpower",
        value: dashboardData.summary.manpower,
        variant: "primary",
        icon: manpowerTileIcon,
        backgroundImage: blueBackground,
      },
      {
        title: "Pending",
        value: dashboardData.summary.pending,
        variant: "light",
        icon: pendingTileIcon,
        backgroundImage: whiteBackground,
      },
      {
        title: "Completed",
        value: dashboardData.summary.completed,
        variant: "light",
        icon: completedTileIcon,
        backgroundImage: whiteBackground,
      },
    ],
    [dashboardData],
  );

  const filteredEntities = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return dashboardData.entities.filter((entity) => {
      const matchesTab =
        activeTab === "All" ||
        entity.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        entity.name.toLowerCase().includes(normalizedSearch) ||
        entity.zone.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, dashboardData.entities, searchValue]);

  const entityLabel =
    activeTab === "All" ? "All Entities" : `${activeTab} Entities`;
  const entityCount =
    activeTab === "All"
      ? dashboardData.summary.sites
      : activeTab === "Pending"
        ? dashboardData.summary.pending
        : dashboardData.summary.completed;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="workflow-dashboard workflow-dual-dashboard">
        <div className="workflow-topbar workflow-dual-topbar">
          <div className="workflow-breadcrumb workflow-dual-breadcrumb">
            <h3 className="workflow-breadcrumb-headline">Dashboard</h3>
            <span className="workflow-breadcrumb-month">(Daily Updates)</span>
          </div>

          <div className="workflow-dual-date-range">
            <DesktopDateRangePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              format="DD/MM/YYYY"
              calendars={2}
              slotProps={{
                textField: {
                  size: "small",
                  placeholder: "DD/MM/YYYY",
                },
              }}
            />
          </div>
        </div>

        <section className="workflow-dual-summary-grid">
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className={`workflow-dual-summary-card workflow-dual-summary-card-${card.variant}`}
            >
              <img
                src={card.backgroundImage}
                alt=""
                className="workflow-dual-card-background-image"
              />

              <div className="workflow-dual-card-copy">
                <p className="workflow-dual-card-title">{card.title}</p>
                <h4 className="workflow-dual-card-value">{card.value}</h4>
              </div>

              <div className="workflow-dual-card-icon-wrap" aria-hidden="true">
                <img
                  src={card.icon}
                  alt=""
                  className="workflow-dual-card-icon-image"
                />
              </div>
            </article>
          ))}
        </section>

        <section className="workflow-dual-table-shell">
          <div className="workflow-dual-table-toolbar">
            <div className="workflow-dual-tabs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`workflow-dual-tab ${activeTab === tab ? "is-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}

              <span className="workflow-dual-entity-count">
                {entityLabel} : {entityCount}
              </span>
            </div>

            <div className="workflow-dual-actions">
              <label
                className="workflow-dual-search"
                aria-label="Search entities"
              >
                <img
                  src={searchIcon}
                  alt=""
                  className="workflow-dual-search-icon-image"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search Wynwy Master"
                />
              </label>

              <button type="button" className="workflow-dual-download-button">
                <DownloadIcon
                  className="workflow-dual-download-icon"
                  viewBox="0 0 24 24"
                />
                Download
              </button>
            </div>
          </div>

          {filteredEntities.length > 0 ? (
            <div className="workflow-dual-entity-grid">
              {filteredEntities.map((entity) => (
                <article key={entity.id} className="workflow-dual-entity-card">
                  <div
                    className={`workflow-dual-entity-status workflow-dual-entity-status-${entity.status}`}
                    aria-hidden="true"
                  />

                  <div className="workflow-dual-entity-copy">
                    <h4 className="workflow-dual-entity-title">
                      {entity.name}
                    </h4>
                    <p className="workflow-dual-entity-zone">
                      <span>zone :</span> {entity.zone}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="workflow-dual-entity-action"
                    aria-label={`Open ${entity.name}`}
                  >
                    <ChevronRightIcon viewBox="0 0 24 24" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="workflow-dual-empty-state">
              <p className="workflow-dual-empty-title">
                No records for this date range
              </p>
              <p className="workflow-dual-empty-text">
                Select 01/03/2026 to 25/03/2026 to view the demo dashboard data.
              </p>
            </div>
          )}
        </section>
      </div>
    </LocalizationProvider>
  );
}
