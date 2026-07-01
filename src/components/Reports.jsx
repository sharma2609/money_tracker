import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Reports component - CSV export functionality
 * Optimized with React.memo, useCallback for handlers, and memoized CSV generation
 */
const Reports = React.memo(function Reports({ transactions }) {
  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Memoize months array
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
  const handleReportTypeChange = useCallback((type) => {
    setReportType(type);
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

  // Filter transactions based on report type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      if (reportType === "monthly") {
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      } else {
        return date.getFullYear() === selectedYear;
      }
    });
  }, [transactions, reportType, selectedMonth, selectedYear]);

  // Memoize CSV generation to prevent recreation on every render
  const generateCSV = useCallback(() => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export for the selected period");
      return;
    }

    const headers = ["Date", "Title", "Type", "Category", "Amount"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.title,
      t.type,
      t.category || "N/A",
      t.amount.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Calculate summary
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const summary = `\n\nSummary\nTotal Income,${income.toFixed(
      2
    )}\nTotal Expense,${expense.toFixed(2)}\nNet Balance,${(
      income - expense
    ).toFixed(2)}`;

    return csvContent + summary;
  }, [filteredTransactions]);

  // Memoize download handler
  const handleDownloadCSV = useCallback(() => {
    const csvContent = generateCSV();
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const periodName =
      reportType === "monthly"
        ? `${months[selectedMonth]}_${selectedYear}`
        : `Annual_${selectedYear}`;

    link.setAttribute("href", url);
    link.setAttribute("download", `Money_Tracker_Report_${periodName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generateCSV, reportType, selectedMonth, selectedYear, months]);

  // Calculate statistics for preview
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  return (
    <div className="reports-container">
      <h2 className="reports-title">Download Reports</h2>

      {/* Report Configuration */}
      <div className="report-config">
        <div className="config-section">
          <label className="config-label">Report Type</label>
          <div className="report-type-selector">
            <button
              className={`report-type-btn ${
                reportType === "monthly" ? "active" : ""
              }`}
              onClick={() => handleReportTypeChange("monthly")}
            >
              Monthly Report
            </button>
            <button
              className={`report-type-btn ${
                reportType === "annual" ? "active" : ""
              }`}
              onClick={() => handleReportTypeChange("annual")}
            >
              Annual Report
            </button>
          </div>
        </div>

        <div className="config-section">
          <label className="config-label">Select Period</label>
          <div className="period-selectors">
            {reportType === "monthly" && (
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
      </div>

      {/* Report Preview */}
      <div className="report-preview">
        <h3 className="preview-title">Report Preview</h3>
        <div className="preview-stats">
          <div className="preview-stat">
            <span className="preview-label">Period:</span>
            <span className="preview-value">
              {reportType === "monthly"
                ? `${months[selectedMonth]} ${selectedYear}`
                : `Year ${selectedYear}`}
            </span>
          </div>
          <div className="preview-stat">
            <span className="preview-label">Transactions:</span>
            <span className="preview-value">{stats.transactionCount}</span>
          </div>
          <div className="preview-stat">
            <span className="preview-label">Total Income:</span>
            <span className="preview-value income">
              +${stats.income.toFixed(2)}
            </span>
          </div>
          <div className="preview-stat">
            <span className="preview-label">Total Expense:</span>
            <span className="preview-value expense">
              -${stats.expense.toFixed(2)}
            </span>
          </div>
          <div className="preview-stat highlight">
            <span className="preview-label">Net Balance:</span>
            <span className="preview-value">${stats.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="download-section">
        <button
          className="download-btn csv"
          onClick={handleDownloadCSV}
          disabled={filteredTransactions.length === 0}
        >
          <span className="download-icon">⬇</span>
          Download as CSV
        </button>
        <p className="download-note">
          CSV format is compatible with Excel, Google Sheets, and other
          spreadsheet applications.
        </p>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="no-data">
          <p>No transactions found for the selected period.</p>
        </div>
      )}
    </div>
  );
});

Reports.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default Reports;
