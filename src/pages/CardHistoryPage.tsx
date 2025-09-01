import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Filter, SortDesc } from "lucide-react";
import { useDataStore } from "../stores/dataStore";
import { useUIStore } from "../stores/uiStore";
import { TransactionList } from "../components/ui/TransactionList";
import type { TransactionFilters, SortOption } from "../types";

export const CardHistoryPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { getCardById, getTransactionsByCard, calculateCardBalance } =
    useDataStore();
  const { openModal } = useUIStore();

  const [filters, setFilters] = useState<TransactionFilters>({
    type: "all",
  });

  const [sortOption, setSortOption] = useState<SortOption>({
    field: "date",
    direction: "desc",
  });

  const card = cardId ? getCardById(cardId) : null;
  const allTransactions = cardId ? getTransactionsByCard(cardId) : [];
  const currentBalance = cardId ? calculateCardBalance(cardId) : 0;

  // Фильтрация и сортировка транзакций
  const filteredAndSortedTransactions = React.useMemo(() => {
    let filtered = allTransactions;

    // Фильтрация по типу
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Фильтрация по датам
    if (filters.dateFrom) {
      filtered = filtered.filter((t) => new Date(t.date) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => new Date(t.date) <= filters.dateTo!);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[sortOption.field];
      let bValue: any = b[sortOption.field];

      if (sortOption.field === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOption.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allTransactions, filters, sortOption]);

  const handleQuickTransaction = () => {
    if (cardId) {
      openModal("quickTransaction", { cardId });
    }
  };

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (field: SortOption["field"]) => {
    setSortOption((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  const getIncomeTotal = () => {
    return filteredAndSortedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getExpenseTotal = () => {
    return filteredAndSortedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  if (!card) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark-text mb-4">
          Карточка не найдена
        </h2>
        <button onClick={() => navigate("/")} className="btn-primary">
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-dark-surface-variant rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-dark-text" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark-text">
              История операций
            </h1>
            <p className="text-dark-text-secondary">{card.name}</p>
          </div>
        </div>

        <button
          onClick={handleQuickTransaction}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Добавить операцию</span>
        </button>
      </div>

      {/* Информация о карточке */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-dark-text-secondary mb-1">
            Текущий баланс
          </h3>
          <p
            className={`text-2xl font-bold ${
              currentBalance >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatCurrency(currentBalance)}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-dark-text-secondary mb-1">
            Всего доходов
          </h3>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(getIncomeTotal())}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-dark-text-secondary mb-1">
            Всего расходов
          </h3>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(getExpenseTotal())}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-dark-text-secondary mb-1">
            Операций найдено
          </h3>
          <p className="text-2xl font-bold text-dark-text">
            {filteredAndSortedTransactions.length}
          </p>
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Фильтры */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-dark-text-secondary" />
              <span className="text-sm font-medium text-dark-text">
                Фильтры:
              </span>
            </div>

            <select
              value={filters.type || "all"}
              onChange={(e) =>
                handleFilterChange({ type: e.target.value as any })
              }
              className="input-field text-sm"
            >
              <option value="all">Все операции</option>
              <option value="income">Только доходы</option>
              <option value="expense">Только расходы</option>
            </select>
          </div>

          {/* Сортировка */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SortDesc className="h-4 w-4 text-dark-text-secondary" />
              <span className="text-sm font-medium text-dark-text">
                Сортировка:
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleSortChange("date")}
                className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                  sortOption.field === "date"
                    ? "text-white"
                    : "text-dark-text-secondary hover:text-dark-text"
                }`}
                style={sortOption.field === "date" ? {backgroundColor: 'var(--color-blue-primary)'} : {}}
              >
                По дате{" "}
                {sortOption.field === "date" &&
                  (sortOption.direction === "desc" ? "↓" : "↑")}
              </button>
              <button
                onClick={() => handleSortChange("amount")}
                className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                  sortOption.field === "amount"
                    ? "text-white"
                    : "text-dark-text-secondary hover:text-dark-text"
                }`}
                style={sortOption.field === "amount" ? {backgroundColor: 'var(--color-blue-primary)'} : {}}
              >
                По сумме{" "}
                {sortOption.field === "amount" &&
                  (sortOption.direction === "desc" ? "↓" : "↑")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список транзакций */}
      <TransactionList transactions={filteredAndSortedTransactions} />
    </div>
  );
};
