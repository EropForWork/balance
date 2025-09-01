import React from "react";
import { Plus, History, Edit, Trash2, Wallet } from "lucide-react";
import type { FinanceCardComponentProps } from "../../types";
import { useDataStore } from "../../stores/dataStore";

export const FinanceCardComponent: React.FC<FinanceCardComponentProps> = ({
  card,
  onEdit,
  onDelete,
  onQuickTransaction,
  onViewHistory,
}) => {
  const { calculateCardBalance, getTransactionsByCard } = useDataStore();
  console.log(card.color);

  const currentBalance = calculateCardBalance(card.id);
  const recentTransactions = getTransactionsByCard(card.id).slice(0, 1);
  const lastTransaction = recentTransactions[0];

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
    }).format(new Date(date));
  };

  return (
    <div
      className="finance-card relative overflow-hidden hover:shadow-2xl transition-all duration-500 group animate-slide-in-scale"
      style={{ background: card.color }}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>

      {/* Заголовок карточки */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{card.name}</h3>
            <p className="text-sm text-white/70">
              Создана {formatDate(card.createdAt)}
            </p>
          </div>
        </div>

        {/* Меню действий */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(card.id)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 group-hover:scale-105"
            title="Редактировать"
          >
            <Edit className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 group-hover:scale-105"
            title="Удалить"
          >
            <Trash2 className="h-5 w-5 text-red-200" />
          </button>
        </div>
      </div>

      {/* Баланс */}
      <div className="relative z-10 mb-6">
        <p className="text-sm text-white/70 mb-2">Текущий баланс</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p
            className={`text-3xl font-bold ${
              currentBalance >= 0 ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {formatCurrency(currentBalance)}
          </p>
        </div>
      </div>

      {/* Последняя операция */}
      {lastTransaction && (
        <div className="relative z-10 mb-6">
          <div className="bg-tertiary backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-xs text-white/60 mb-2">Последняя операция</p>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">
                  {lastTransaction.description}
                </p>
                <p className="text-xs text-white/60">
                  {formatDate(lastTransaction.date)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    lastTransaction.type === "income"
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                ></div>
                <p
                  className={`text-sm font-bold ${
                    lastTransaction.type === "income"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {lastTransaction.type === "income" ? "+" : "-"}
                  {formatCurrency(Math.abs(lastTransaction.amount))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="relative z-10 flex space-x-3">
        <button
          onClick={() => onQuickTransaction(card.id)}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Операция</span>
        </button>

        <button
          onClick={() => onViewHistory(card.id)}
          className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          title="Посмотреть историю"
        >
          <History className="h-5 w-5" />
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/3 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
    </div>
  );
};
