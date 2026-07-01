import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Settings component - Theme toggle, category management, data clearing
 * Optimized with React.memo and useCallback for event handlers
 */
const Settings = React.memo(function Settings({
  categories,
  onUpdateCategories,
  onClearHistory,
}) {
  const { theme, toggleTheme } = useTheme();
  const [newCategory, setNewCategory] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Memoize event handlers
  const handleAddCategory = useCallback(
    (e) => {
      e.preventDefault();
      if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        onUpdateCategories([...categories, newCategory.trim()]);
        setNewCategory("");
      }
    },
    [newCategory, categories, onUpdateCategories]
  );

  const handleDeleteCategory = useCallback(
    (category) => {
      onUpdateCategories(categories.filter((c) => c !== category));
    },
    [categories, onUpdateCategories]
  );

  const handleClearHistory = useCallback(() => {
    if (showConfirm) {
      onClearHistory();
      setShowConfirm(false);
    }
  }, [showConfirm, onClearHistory]);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      {/* Theme Toggle */}
      <div className="settings-section">
        <h3 className="section-title">Appearance</h3>
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Theme</div>
            <div className="setting-description">
              Switch between light and dark mode
            </div>
          </div>
          <button
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>

      {/* Category Management */}
      <div className="settings-section">
        <h3 className="section-title">Categories</h3>
        <div className="setting-item">
          <form onSubmit={handleAddCategory} className="add-category-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
              className="category-input"
            />
            <button type="submit" className="add-category-btn">
              Add
            </button>
          </form>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="delete-category-btn"
                aria-label={`Delete ${category}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3 className="section-title">Data Management</h3>
        <div className="setting-item danger-zone">
          <div className="setting-info">
            <div className="setting-label">Clear Transaction History</div>
            <div className="setting-description">
              Permanently delete all transactions. This action cannot be undone.
            </div>
          </div>
          {!showConfirm ? (
            <button className="danger-btn" onClick={() => setShowConfirm(true)}>
              Clear History
            </button>
          ) : (
            <div className="confirm-actions">
              <button
                className="danger-btn confirm"
                onClick={handleClearHistory}
              >
                Confirm Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Settings.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdateCategories: PropTypes.func.isRequired,
  onClearHistory: PropTypes.func.isRequired,
};

export default Settings;
