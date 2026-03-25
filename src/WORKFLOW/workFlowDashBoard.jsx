import React, { Fragment, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SvgIcon from "@mui/material/SvgIcon";
import actionsIcon from "../assets/actions_icon.svg";
import asPerCorporateIcon from "../assets/aspercorporate.svg";
import declineIcon from "../assets/decline.svg";
import growthIcon from "../assets/growth.svg";
import WorkflowActionPopUp from "./WorkflowActionPopUp";
import "./workFlowDashBoard.scss";

const STATE_OPTIONS = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh"];
const REGION_OPTIONS = ["Trichy", "Chennai"];

function KeyboardArrowDownIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </SvgIcon>
  );
}

function KeyboardArrowUpIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m7.41 15.41 4.59-4.58 4.59 4.58L18 14l-6-6-6 6z" />
    </SvgIcon>
  );
}

const SUMMARY_CARDS = [
  {
    title: "As per corporate",
    accentClass: "workflow-summary-card-corporate",
    icon: "B",
    rows: [
      { label: "Sites", value: "93" },
      { label: "Manpower", value: "4100" },
      { label: "Business Value", value: "Rs 21.7Lkh" },
    ],
  },
  {
    title: "Actual",
    accentClass: "workflow-summary-card-actual",
    icon: "B",
    rows: [
      { label: "Sites", value: "18" },
      { label: "Manpower", value: "7650" },
      { label: "Business Value", value: "Rs 11.0Cr" },
    ],
  },
  {
    title: "Difference",
    accentClass: "workflow-summary-card-difference",
    icon: "B",
    rows: [
      { label: "Sites", value: "75", valueClass: "workflow-negative" },
      { label: "Manpower", value: "3550", valueClass: "workflow-positive" },
      {
        label: "Business Value",
        value: "+ Rs 10.8Cr",
        valueClass: "workflow-positive",
      },
    ],
  },
];

const SUMMARY_ROWS = [
  {
    id: "kumar-a",
    name: "Kumar A",
    designation: "GM",
    region: "Chennai",
    zone: "Medavakkam, Tambaram",
    zoneTag: "+7More",
    sites: "0",
    manpower: "3550",
    businessValue: "109887000",
    trend: "up",
    popupSummary: [
      {
        title: "As per corporate",
        accentClass: "workflow-action-popup-card-corporate",
        rows: [
          { label: "Sites", value: "9" },
          { label: "Manpower", value: "5200" },
          { label: "Business Value", value: "Rs11.0Cr" },
        ],
      },
      {
        title: "Actual",
        accentClass: "workflow-action-popup-card-actual",
        rows: [
          { label: "Sites", value: "9" },
          { label: "Manpower", value: "1650" },
          { label: "Business Value", value: "Rs2.9Lkh" },
        ],
      },
      {
        title: "Difference",
        accentClass: "workflow-action-popup-card-difference",
        rows: [
          { label: "Sites", value: "0" },
          {
            label: "Manpower",
            value: "3550",
            valueClass: "workflow-action-popup-positive",
          },
          {
            label: "Business Value",
            value: "Rs11.0Cr",
            valueClass: "workflow-action-popup-positive",
            trend: "up",
          },
        ],
      },
    ],
    children: [
      {
        id: "kali",
        name: "Kali",
        designation: "Assistant Manager",
        region: "Chennai",
        zone: "Pallavaram Chennai zone 2",
        zoneTag: "+2More",
        sites: "3",
        manpower: "3500",
        businessValue: "75000",
        trend: "up",
        popupSummary: [
          {
            title: "As per corporate",
            accentClass: "workflow-action-popup-card-corporate",
            rows: [
              { label: "Sites", value: "4" },
              { label: "Manpower", value: "3600" },
              { label: "Business Value", value: "Rs1.2Cr" },
            ],
          },
          {
            title: "Actual",
            accentClass: "workflow-action-popup-card-actual",
            rows: [
              { label: "Sites", value: "1" },
              { label: "Manpower", value: "100" },
              { label: "Business Value", value: "Rs45000" },
            ],
          },
          {
            title: "Difference",
            accentClass: "workflow-action-popup-card-difference",
            rows: [
              {
                label: "Sites",
                value: "3",
                valueClass: "workflow-action-popup-negative",
              },
              {
                label: "Manpower",
                value: "3500",
                valueClass: "workflow-action-popup-positive",
              },
              {
                label: "Business Value",
                value: "Rs75000",
                valueClass: "workflow-action-popup-positive",
                trend: "up",
              },
            ],
          },
        ],
      },

      {
        id: "vadivel",
        name: "Vadivel",
        designation: "Executive",
        region: "Chennai",
        zone: "Chennai zone 2",
        sites: "0",
        manpower: "450",
        businessValue: "-40000",
        trend: "down",
        popupSummary: [
          {
            title: "As per corporate",
            accentClass: "workflow-action-popup-card-corporate",
            rows: [
              { label: "Sites", value: "2" },
              { label: "Manpower", value: "900" },
              { label: "Business Value", value: "Rs80000" },
            ],
          },
          {
            title: "Actual",
            accentClass: "workflow-action-popup-card-actual",
            rows: [
              { label: "Sites", value: "2" },
              { label: "Manpower", value: "450" },
              { label: "Business Value", value: "Rs40000" },
            ],
          },
          {
            title: "Difference",
            accentClass: "workflow-action-popup-card-difference",
            rows: [
              { label: "Sites", value: "0" },
              {
                label: "Manpower",
                value: "450",
                valueClass: "workflow-action-popup-positive",
              },
              {
                label: "Business Value",
                value: "-Rs40000",
                valueClass: "workflow-action-popup-negative",
                trend: "down",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "pandiyan-v",
    name: "PANDIYAN V",
    designation: "GM",
    region: "Trichy",
    zone: "Trichy",
    sites: "5",
    manpower: "800",
    businessValue: "-175000",
    trend: "down",
    popupSummary: [
      {
        title: "As per corporate",
        accentClass: "workflow-action-popup-card-corporate",
        rows: [
          { label: "Sites", value: "7" },
          { label: "Manpower", value: "1600" },
          { label: "Business Value", value: "Rs2.6Cr" },
        ],
      },
      {
        title: "Actual",
        accentClass: "workflow-action-popup-card-actual",
        rows: [
          { label: "Sites", value: "2" },
          { label: "Manpower", value: "800" },
          { label: "Business Value", value: "Rs1.8Cr" },
        ],
      },
      {
        title: "Difference",
        accentClass: "workflow-action-popup-card-difference",
        rows: [
          {
            label: "Sites",
            value: "5",
            valueClass: "workflow-action-popup-negative",
          },
          {
            label: "Manpower",
            value: "800",
            valueClass: "workflow-action-popup-positive",
          },
          {
            label: "Business Value",
            value: "-Rs175000",
            valueClass: "workflow-action-popup-negative",
            trend: "down",
          },
        ],
      },
    ],
    children: [
      {
        id: "mohan",
        name: "Mohan",
        designation: "Assistant Manager",
        region: "Trichy",
        zone: "Trichy Central",
        zoneTag: "+2More",
        sites: "2",
        manpower: "420",
        businessValue: "35000",
        trend: "up",
        popupSummary: [
          {
            title: "As per corporate",
            accentClass: "workflow-action-popup-card-corporate",
            rows: [
              { label: "Sites", value: "3" },
              { label: "Manpower", value: "900" },
              { label: "Business Value", value: "Rs90000" },
            ],
          },
          {
            title: "Actual",
            accentClass: "workflow-action-popup-card-actual",
            rows: [
              { label: "Sites", value: "1" },
              { label: "Manpower", value: "480" },
              { label: "Business Value", value: "Rs55000" },
            ],
          },
          {
            title: "Difference",
            accentClass: "workflow-action-popup-card-difference",
            rows: [
              {
                label: "Sites",
                value: "2",
                valueClass: "workflow-action-popup-negative",
              },
              {
                label: "Manpower",
                value: "420",
                valueClass: "workflow-action-popup-positive",
              },
              {
                label: "Business Value",
                value: "Rs35000",
                valueClass: "workflow-action-popup-positive",
                trend: "up",
              },
            ],
          },
        ],
      },
    ],
  },
];

function BusinessValueCell({ value, trend }) {
  const trendClass =
    trend === "down"
      ? "workflow-trend-down"
      : trend === "up"
        ? "workflow-trend-up"
        : "workflow-trend-neutral";

  return (
    <div className="workflow-business-value">
      <span>{value}</span>
      {trend !== "neutral" && (
        <span className={`workflow-trend-chip ${trendClass}`}>
          <img
            src={trend === "down" ? declineIcon : growthIcon}
            alt={trend === "down" ? "Decline" : "Growth"}
            className="workflow-trend-icon"
          />
        </span>
      )}
    </div>
  );
}

function SummaryChildRows({ rows, onOpenAction }) {
  return (
    <Box className="workflow-collapse-panel">
      <Table size="small" aria-label="summary details">
        <TableBody>
          {rows.map((child) => (
            <TableRow key={child.id} className="workflow-child-row">
              <TableCell className="workflow-cell-spoc workflow-cell-spoc-child">
                {child.name}
              </TableCell>
              <TableCell className="workflow-cell-designation">
                {child.designation}
              </TableCell>
              <TableCell className="workflow-cell-region">
                {child.region}
              </TableCell>
              <TableCell className="workflow-cell-zone">
                <span>{child.zone}</span>
                {child.zoneTag && (
                  <span className="workflow-zone-tag">{child.zoneTag}</span>
                )}
              </TableCell>
              <TableCell className="workflow-cell-diff">
                {child.sites}
              </TableCell>
              <TableCell className="workflow-cell-diff">
                {child.manpower}
              </TableCell>
              <TableCell className="workflow-cell-diff">
                <BusinessValueCell
                  value={child.businessValue}
                  trend={child.trend}
                />
              </TableCell>
              <TableCell className="workflow-cell-actions">
                <button
                  type="button"
                  className="workflow-action-button"
                  onClick={() => onOpenAction(child)}
                >
                  <img
                    src={actionsIcon}
                    alt="Actions"
                    className="workflow-action-icon"
                  />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function SummaryRow({ row, isOpen, onToggle, onOpenAction }) {
  const hasChildren = row.children.length > 0;

  return (
    <Fragment>
      <TableRow className="workflow-parent-row">
        <TableCell className="workflow-cell-spoc">
          <div className="workflow-spoc-name">
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={() => onToggle(row.id)}
                className="workflow-expand-button"
              >
                {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </IconButton>
            ) : (
              <span className="workflow-expand-spacer" />
            )}
            <span>{row.name}</span>
          </div>
        </TableCell>
        <TableCell className="workflow-cell-designation">
          {row.designation}
        </TableCell>
        <TableCell className="workflow-cell-region">{row.region}</TableCell>
        <TableCell className="workflow-cell-zone">
          <span>{row.zone}</span>
          {row.zoneTag && (
            <span className="workflow-zone-tag">{row.zoneTag}</span>
          )}
        </TableCell>
        <TableCell className="workflow-cell-diff">{row.sites}</TableCell>
        <TableCell className="workflow-cell-diff">{row.manpower}</TableCell>
        <TableCell className="workflow-cell-diff">
          <BusinessValueCell value={row.businessValue} trend={row.trend} />
        </TableCell>
        <TableCell className="workflow-cell-actions">
          <button
            type="button"
            className="workflow-action-button"
            onClick={() => onOpenAction(row)}
          >
            <img
              src={actionsIcon}
              alt="Actions"
              className="workflow-action-icon"
            />
          </button>
        </TableCell>
      </TableRow>

      {hasChildren && (
        <TableRow className="workflow-collapse-row">
          <TableCell colSpan={8} className="workflow-collapse-cell">
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <SummaryChildRows rows={row.children} onOpenAction={onOpenAction} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

export default function WorkFlowDashBoard() {
  const [stateQuery, setStateQuery] = useState("");
  const [regionQuery, setRegionQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  const [openRowId, setOpenRowId] = useState("kumar-a");
  const [selectedActionRow, setSelectedActionRow] = useState(null);

  const filteredStates = useMemo(
    () =>
      STATE_OPTIONS.filter((item) =>
        item.toLowerCase().includes(stateQuery.toLowerCase()),
      ),
    [stateQuery],
  );

  const filteredRegions = useMemo(
    () =>
      REGION_OPTIONS.filter((item) =>
        item.toLowerCase().includes(regionQuery.toLowerCase()),
      ),
    [regionQuery],
  );

  const handleSelect = (type, value) => {
    if (type === "state") {
      setStateQuery(value);
    } else {
      setRegionQuery(value);
    }

    setOpenDropdown("");
  };

  const handleRowToggle = (rowId) => {
    setOpenRowId((currentRowId) => (currentRowId === rowId ? "" : rowId));
  };

  const handleOpenActionPopup = (row) => {
    setSelectedActionRow(row);
  };

  return (
    <div className="workflow-dashboard">
      <div className="workflow-topbar">
        <div className="workflow-breadcrumb">
          <h3 className="workflow-breadcrumb-headline">Span Dashboard</h3>
          <span className="workflow-breadcrumb-month">(March)</span>
        </div>

        <div className="workflow-filters">
          <div className="workflow-select-wrap">
            <input
              type="text"
              className="workflow-select"
              value={stateQuery}
              placeholder="Please Select State"
              aria-label="Select state"
              onFocus={() => setOpenDropdown("state")}
              onChange={(event) => {
                setStateQuery(event.target.value);
                setOpenDropdown("state");
              }}
              onBlur={() => {
                window.setTimeout(() => setOpenDropdown(""), 120);
              }}
            />

            {openDropdown === "state" && (
              <div className="workflow-dropdown-menu">
                {filteredStates.length > 0 ? (
                  filteredStates.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="workflow-dropdown-option"
                      onMouseDown={() => handleSelect("state", item)}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <div className="workflow-dropdown-empty">No state found</div>
                )}
              </div>
            )}
          </div>

          <div className="workflow-select-wrap">
            <input
              type="text"
              className="workflow-select"
              value={regionQuery}
              placeholder="Please Select Region"
              aria-label="Select region"
              onFocus={() => setOpenDropdown("region")}
              onChange={(event) => {
                setRegionQuery(event.target.value);
                setOpenDropdown("region");
              }}
              onBlur={() => {
                window.setTimeout(() => setOpenDropdown(""), 120);
              }}
            />

            {openDropdown === "region" && (
              <div className="workflow-dropdown-menu">
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="workflow-dropdown-option"
                      onMouseDown={() => handleSelect("region", item)}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <div className="workflow-dropdown-empty">No region found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="workflow-summary-grid">
        {SUMMARY_CARDS.map((card) => (
          <section
            key={card.title}
            className={`workflow-summary-card ${card.accentClass}`}
          >
            <div className="workflow-summary-header">
              <div className="workflow-summary-icon" aria-hidden="true">
                <img
                  src={asPerCorporateIcon}
                  alt=""
                  className="workflow-summary-icon-image"
                />
              </div>
              <h4 className="workflow-summary-title">{card.title}</h4>
            </div>

            <div className="workflow-summary-body">
              {card.rows.map((row) => (
                <div key={row.label} className="workflow-summary-row">
                  <span className="workflow-summary-label">{row.label}</span>
                  <span
                    className={`workflow-summary-value ${row.valueClass || ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="workflow-table-card">
        <div className="workflow-table-card-header">
          <h4 className="workflow-table-title">Operational Summary</h4>
          <button type="button" className="workflow-download-button">
            Download
          </button>
        </div>

        <TableContainer
          component={Paper}
          elevation={0}
          className="workflow-table-container"
        >
          <Table aria-label="operational summary table">
            <TableHead>
              <TableRow className="workflow-table-header-row">
                <TableCell className="workflow-table-head" rowSpan={2}>
                  Operations SPOC
                </TableCell>
                <TableCell className="workflow-table-head" rowSpan={2}>
                  Designation
                </TableCell>
                <TableCell className="workflow-table-head" rowSpan={2}>
                  Region
                </TableCell>
                <TableCell className="workflow-table-head" rowSpan={2}>
                  Zone
                </TableCell>
                <TableCell className="workflow-table-head" colSpan={3}>
                  Difference
                </TableCell>
                <TableCell className="workflow-table-head" rowSpan={2}>
                  Actions
                </TableCell>
              </TableRow>
              <TableRow className="workflow-table-subheader-row">
                <TableCell className="workflow-table-subhead">Sites</TableCell>
                <TableCell className="workflow-table-subhead">
                  Manpower
                </TableCell>
                <TableCell className="workflow-table-subhead">
                  Business Value
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {SUMMARY_ROWS.map((row) => (
                <SummaryRow
                  key={row.id}
                  row={row}
                  isOpen={openRowId === row.id}
                  onToggle={handleRowToggle}
                  onOpenAction={handleOpenActionPopup}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <WorkflowActionPopUp
        isOpen={Boolean(selectedActionRow)}
        onClose={() => setSelectedActionRow(null)}
        title={selectedActionRow?.name || ""}
        summaryCards={selectedActionRow?.popupSummary || []}
      />
    </div>
  );
}
