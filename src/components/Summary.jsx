import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Summary component - displays total income, expense, and balance
 * Optimized with React.memo and useMemo for calculations
 */
const Summary = React.memo(function Summary({ transactions }) {
  // Memoize calculations to prevent recalculation on every render
  const { income, expense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  return (
    <div className="summary">
      <div className="summary-card">
        <div className="summary-label">Total Income</div>
        <div className="summary-value income">${income.toFixed(2)}</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Total Expense</div>
        <div className="summary-value expense">${expense.toFixed(2)}</div>
      </div>

      <div className="summary-card balance-card">
        <div className="summary-label">Net Balance</div>
        <div className="summary-value balance">${balance.toFixed(2)}</div>
      </div>
    </div>
  );
});

Summary.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default Summary;
