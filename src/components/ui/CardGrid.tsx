import React from "react";
import { Plus, CreditCard } from "lucide-react";
import type { CardGridProps } from "../../types";
import { FinanceCardComponent } from "./FinanceCardComponent";

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onEditCard,
  onDeleteCard,
  onQuickTransaction,
  onViewHistory,
  onAddCard,
}) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-dark-surface border-2 border-dashed border-dark-border rounded-full flex items-center justify-center mb-6">
          <CreditCard className="h-12 w-12 text-dark-text-secondary" />
        </div>
        <h3 className="text-xl font-medium text-dark-text mb-2">
          Пока нет карточек
        </h3>
        <p className="text-dark-text-secondary mb-6 max-w-md mx-auto">
          Создайте первую финансовую карточку, чтобы начать отслеживать свои
          доходы и расходы. Это может быть банковская карта, наличные или любой
          другой счёт.
        </p>
        <button
          onClick={onAddCard}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Создать первую карточку</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-text">
          Мои карточки ({cards.length})
        </h2>
        <button
          onClick={onAddCard}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Добавить карточку</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <FinanceCardComponent
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onQuickTransaction={onQuickTransaction}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    </div>
  );
};
