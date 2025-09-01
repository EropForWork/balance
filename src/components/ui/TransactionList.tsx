import React from "react";
import { ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import type { TransactionListProps } from "../../types";

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(date));
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-dark-surface border-2 border-dashed border-dark-border rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-dark-text-secondary" />
        </div>
        <h3 className="text-lg font-medium text-dark-text mb-2">
          Пока нет операций
        </h3>
        <p className="text-dark-text-secondary">
          Добавьте первую операцию, чтобы начать отслеживать историю транзакций.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="card p-4 hover:bg-dark-surface-variant transition-colors group"
        >
          <div className="flex items-center space-x-4">
            {/* Иконка типа операции */}
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.type === "income"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowDownLeft className="h-5 w-5" />
              )}
            </div>

            {/* Информация о транзакции */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-dark-text truncate">
                    {transaction.description}
                  </h4>
                  <p className="text-sm text-dark-text-secondary">
                    <span className="hidden sm:inline">
                      {formatDate(transaction.date)}
                    </span>
                    <span className="sm:hidden">
                      {formatDateShort(transaction.date)}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    {transaction.type === "income" ? "Доход" : "Расход"}
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки действий (появляются при наведении) */}
            {(onEditTransaction || onDeleteTransaction) && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEditTransaction && (
                  <button
                    onClick={() => onEditTransaction(transaction.id)}
                    className="p-1 hover:bg-dark-surface rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Calendar className="h-4 w-4 text-dark-text-secondary hover:text-dark-text" />
                  </button>
                )}
                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-1 hover:bg-dark-surface rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <ArrowDownLeft className="h-4 w-4 text-red-400 hover:text-red-300" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
