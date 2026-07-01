import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * TransactionList - Displays all transactions in a clean list format
 * Optimized with React.memo, useMemo for sorting, and useCallback for handlers
 */
const TransactionList = React.memo(function TransactionList({
  transactions,
  onDeleteTransaction,
}) {
  // Memoize sorted transactions to prevent re-sorting on every render
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [transactions]);

  // Memoize delete handler to prevent function recreation
  const handleDelete = useCallback(
    (id) => {
      onDeleteTransaction(id);
    },
    [onDeleteTransaction]
  );
  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h3 className="list-title">Recent Transactions</h3>
        <div className="empty-state">
          <p>No transactions yet.</p>
          <p>Start by adding your first transaction.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3 className="list-title">Recent Transactions</h3>

      <div className="transactions">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-main">
              <div className="transaction-info">
                <div className="transaction-title">{transaction.title}</div>
                <div className="transaction-meta">
                  <span className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {transaction.category && (
                    <>
                      <span className="meta-separator">•</span>
                      <span className="transaction-category">
                        {transaction.category}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="transaction-amount-wrapper">
                <div className={`transaction-amount ${transaction.type}`}>
                  ${transaction.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="delete-btn"
                  aria-label="Delete transaction"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onDeleteTransaction: PropTypes.func.isRequired,
};

export default TransactionList;
