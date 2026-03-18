import axios from "axios";
import React, { useEffect, useState } from "react";
import popupImage from "./assets/popupimage.png";
import "./raiseTicketPopUp.scss";

function CustomDropdown({
  label,
  required = false,
  placeholder = "Select...",
  options,
  value,
  onChange,
  disabled = false,
  error = "",
  isOpen,
  onToggle,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const selectedOption = options.find((item) => item.id === value);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(normalizedSearchTerm),
  );
  const displayValue =
    isOpen && !disabled ? searchTerm : selectedOption?.name || placeholder;

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <div className="raise-ticket-field">
      <span>
        {label} {required ? <strong>*</strong> : null}
      </span>

      <div
        className={`raise-ticket-dropdown ${isOpen ? "is-open" : ""} ${
          disabled ? "is-disabled" : ""
        }`}
      >
        <div
          className="raise-ticket-dropdown-trigger"
          onClick={() => {
            if (!disabled && !isOpen) {
              onToggle();
            }
          }}
        >
          {isOpen && !disabled ? (
            <input
              type="text"
              className="raise-ticket-dropdown-input"
              value={displayValue}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <span
              className={`raise-ticket-dropdown-value ${
                selectedOption ? "has-value" : ""
              }`}
            >
              {displayValue}
            </span>
          )}
          <span className="raise-ticket-dropdown-arrow">v</span>
        </div>

        {isOpen ? (
          <div className="raise-ticket-dropdown-menu">
            {filteredOptions.length ? (
              filteredOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`raise-ticket-dropdown-option ${
                    item.id === value ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    onChange(item.id);
                    onClose();
                  }}
                >
                  {item.name}
                </button>
              ))
            ) : (
              <div className="raise-ticket-dropdown-empty">
                No results found.
              </div>
            )}
          </div>
        ) : null}
      </div>

      {error ? <span className="raise-ticket-error">{error}</span> : null}
    </div>
  );
}

export default function RaiseTicketPopUp({ isOpen, onClose }) {
  const [problemCategories, setProblemCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedProblemCategory, setSelectedProblemCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [subCategoryError, setSubCategoryError] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");

  const problemCategoryUrl =
    "https://apionboarding.uds.in/ticketapp/clientissuelist/?search=&page_size=20&page=1";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const controller = new AbortController();

    const fetchProblemCategories = async () => {
      try {
        setCategoryError("");

        const response = await axios.get(problemCategoryUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          signal: controller.signal,
        });

        const categories = Array.isArray(response.data?.data)
          ? response.data.data.map((item) => ({
              id: item.id,
              name: item.name,
            }))
          : [];

        setProblemCategories(categories);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Problem category API error:", error);
        setCategoryError(
          error.response?.data?.status?.message ||
            error.message ||
            "Failed to load problem categories",
        );
      }
    };

    fetchProblemCategories();

    return () => controller.abort();
  }, [isOpen, problemCategoryUrl]);

  useEffect(() => {
    if (!selectedProblemCategory) {
      setSubCategories([]);
      setSelectedSubCategory("");
      setSelectedPriority("");
      return undefined;
    }

    const controller = new AbortController();

    const fetchSubCategories = async () => {
      try {
        setSubCategoryError("");

        const response = await axios.get(
          `https://apionboarding.uds.in/ticketapp/clientsubissuelist/?category=${selectedProblemCategory}&search=&page_size=20&page=1&active=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            signal: controller.signal,
          },
        );

        const categories = Array.isArray(response.data?.data)
          ? response.data.data.map((item) => ({
              id: item.id,
              name: item.name,
              priority: item.Priority,
            }))
          : [];

        setSubCategories(categories);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        console.error("Sub category API error:", error);
        setSubCategoryError(
          error.response?.data?.status?.message ||
            error.message ||
            "Failed to load sub categories",
        );
      }
    };

    fetchSubCategories();

    return () => controller.abort();
  }, [selectedProblemCategory]);

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdown("");
    }
  }, [isOpen]);

  const priorityOptions = [
    { id: "0", name: "Low" },
    { id: "1", name: "Medium" },
    { id: "2", name: "High" },
  ];

  const handleProblemCategoryChange = (nextValue) => {
    setSelectedProblemCategory(nextValue);
    setSelectedSubCategory("");
    setSelectedPriority("");
  };

  const handleSubCategoryChange = (nextValue) => {
    setSelectedSubCategory(nextValue);

    const matchedSubCategory = subCategories.find(
      (item) => item.id === nextValue,
    );

    setSelectedPriority(matchedSubCategory?.priority || "");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="raise-ticket-overlay" onClick={onClose}>
      <div
        className="raise-ticket-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="raise-ticket-close" onClick={onClose}>
          x
        </button>

        <div className="raise-ticket-layout">
          <div className="raise-ticket-hero">
            <img
              src={popupImage}
              alt="Help desk support"
              className="raise-ticket-hero-image"
            />
          </div>

          <div className="raise-ticket-form-panel">
            <div className="raise-ticket-form-grid">
              <CustomDropdown
                label="Problem Category"
                required
                options={problemCategories}
                value={selectedProblemCategory}
                onChange={handleProblemCategoryChange}
                error={categoryError}
                isOpen={openDropdown === "problem"}
                onToggle={() =>
                  setOpenDropdown((current) =>
                    current === "problem" ? "" : "problem",
                  )
                }
                onClose={() => setOpenDropdown("")}
              />

              <CustomDropdown
                label="Sub Category"
                required
                options={subCategories}
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                disabled={!selectedProblemCategory}
                error={subCategoryError}
                isOpen={openDropdown === "sub"}
                onToggle={() =>
                  setOpenDropdown((current) => (current === "sub" ? "" : "sub"))
                }
                onClose={() => setOpenDropdown("")}
              />

              <CustomDropdown
                label="Priority"
                required
                options={priorityOptions}
                value={selectedPriority}
                onChange={setSelectedPriority}
                isOpen={openDropdown === "priority"}
                onToggle={() =>
                  setOpenDropdown((current) =>
                    current === "priority" ? "" : "priority",
                  )
                }
                onClose={() => setOpenDropdown("")}
              />
            </div>

            <label className="raise-ticket-field raise-ticket-field--full">
              <span>
                Description <strong>*</strong>
              </span>
              <textarea rows="6" />
            </label>

            <div className="raise-ticket-upload">
              <p className="raise-ticket-upload-label">Attachments Upload</p>
              <div className="raise-ticket-upload-box">
                <div className="raise-ticket-upload-icon">
                  <span>^</span>
                </div>
                <p className="raise-ticket-upload-text">
                  Drag your files here to upload or{" "}
                  <button type="button" className="raise-ticket-upload-link">
                    Browse file
                  </button>
                </p>
              </div>
            </div>

            <div className="raise-ticket-actions">
              <button type="button" className="raise-ticket-submit">
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
