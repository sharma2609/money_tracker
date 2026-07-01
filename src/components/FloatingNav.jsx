import React, { useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Floating vertical navigation bar
 * Fixed on the far right edge, mid-screen aligned
 * Optimized with React.memo and useCallback
 */
const FloatingNav = React.memo(function FloatingNav({
  currentView,
  onNavigate,
}) {
  const navItems = [
    { id: "overview", label: "Overview", icon: "●" },
    { id: "analysis", label: "Analysis", icon: "◐" },
    { id: "reports", label: "Reports", icon: "⬇" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  // Memoize navigation handler
  const handleNavigate = useCallback(
    (itemId) => {
      onNavigate(itemId);
    },
    [onNavigate]
  );

  return (
    <nav className="floating-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item.id)}
          className={`nav-item ${currentView === item.id ? "active" : ""}`}
          title={item.label}
          aria-label={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
        </button>
      ))}
    </nav>
  );
});

FloatingNav.propTypes = {
  currentView: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default FloatingNav;
