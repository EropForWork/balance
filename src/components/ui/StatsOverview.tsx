import React from "react";
import { TrendingUp, TrendingDown, CreditCard, Activity } from "lucide-react";
import type { StatsOverviewProps } from "../../types";

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalBalance,
  totalCards,
  recentTransactions,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  const stats = [
    {
      icon: <CreditCard className="h-6 w-6 text-blue-400" />,
      label: "Всего карточек",
      value: totalCards.toString(),
      description: "активных счетов",
    },
    {
      icon:
        totalBalance >= 0 ? (
          <TrendingUp className="h-6 w-6 text-green-400" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-400" />
        ),
      label: "Общий баланс",
      value: formatCurrency(totalBalance),
      description: totalBalance >= 0 ? "положительный" : "отрицательный",
      isBalance: true,
    },
    {
      icon: <Activity className="h-6 w-6 text-purple-400" />,
      label: "Операций за период",
      value: recentTransactions.toString(),
      description: "последних транзакций",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <p className="text-xs font-medium text-dark-text-secondary">
                {stat.label}
              </p>
              <p
                className={`text-xl font-bold ${
                  stat.isBalance
                    ? totalBalance >= 0
                      ? "text-green-400"
                      : "text-red-400"
                    : "text-dark-text"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-dark-text-secondary mt-1">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
