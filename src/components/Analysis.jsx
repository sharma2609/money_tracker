import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Analysis component - Financial analysis with category breakdown
 * Optimized with React.memo and useCallback for event handlers
 */
const Analysis = React.memo(function Analysis({ transactions }) {
  const [viewType, setViewType] = useState("monthly"); // monthly or annual
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Memoize months array to prevent recreation
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  // Memoize event handlers
  const handleViewTypeChange = useCallback((type) => {
    setViewType(type);
  }, []);

  const handleMonthChange = useCallback((e) => {
    setSelectedMonth(Number(e.target.value));
  }, []);

  const handleYearChange = useCallback((e) => {
    setSelectedYear(Number(e.target.value));
  }, []);

  // Get unique years from transactions
  const availableYears = useMemo(() => {
    const years = [
      ...new Set(transactions.map((t) => new Date(t.date).getFullYear())),
    ];
    return years.sort((a, b) => b - a);
  }, [transactions]);

  // Filter transactions based on view type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      if (viewType === "monthly") {
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      } else {
        return date.getFullYear() === selectedYear;
      }
    });
  }, [transactions, viewType, selectedMonth, selectedYear]);

  // Calculate statistics
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    filteredTransactions
      .filter((t) => t.type === "expense" && t.category)
      .forEach((t) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    return {
      income,
      expense,
      balance: income - expense,
      categoryBreakdown,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  return (
    <div className="analysis-container">
      <h2 className="analysis-title">Financial Analysis</h2>

      {/* View Type Selector */}
      <div className="analysis-controls">
        <div className="view-type-selector">
          <button
            className={`view-type-btn ${
              viewType === "monthly" ? "active" : ""
            }`}
            onClick={() => handleViewTypeChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={`view-type-btn ${viewType === "annual" ? "active" : ""}`}
            onClick={() => handleViewTypeChange("annual")}
          >
            Annual
          </button>
        </div>

        <div className="period-selectors">
          {viewType === "monthly" && (
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="period-select"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
          )}
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="period-select"
          >
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="analysis-stats">
        <div className="stat-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value income">+${stats.income.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Expense</div>
          <div className="stat-value expense">-${stats.expense.toFixed(2)}</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-label">Net Balance</div>
          <div className="stat-value">${stats.balance.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Transactions</div>
          <div className="stat-value">{stats.transactionCount}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="category-breakdown">
          <h3 className="breakdown-title">Expense by Category</h3>
          <div className="breakdown-list">
            {Object.entries(stats.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / stats.expense) * 100;
                return (
                  <div key={category} className="breakdown-item">
                    <div className="breakdown-info">
                      <span className="breakdown-category">{category}</span>
                      <span className="breakdown-amount">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="breakdown-bar-container">
                      <div
                        className="breakdown-bar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="breakdown-percentage">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div className="no-data">
          <p>No transactions found for the selected period.</p>
        </div>
      )}
    </div>
  );
});

Analysis.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default Analysis;
