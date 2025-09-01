import React from "react";
import { useNavigate } from "react-router-dom";
import { useDataStore } from "../stores/dataStore";
import { useUIStore } from "../stores/uiStore";
import { StatsOverview } from "../components/ui/StatsOverview";
import { CardGrid } from "../components/ui/CardGrid";

export const DashboardPage: React.FC = () => {
  const { cards, getTotalBalance, getRecentTransactions } = useDataStore();

  const { openModal } = useUIStore();
  const navigate = useNavigate();

  const totalBalance = getTotalBalance();
  const recentTransactions = getRecentTransactions(10);

  const handleAddCard = () => {
    openModal("addCard");
  };

  const handleEditCard = (cardId: string) => {
    openModal("editCard", { cardId });
  };

  const handleDeleteCard = (cardId: string) => {
    openModal("deleteConfirmation", { cardId, type: "card" });
  };

  const handleQuickTransaction = (cardId: string) => {
    openModal("quickTransaction", { cardId });
  };

  const handleViewHistory = (cardId: string) => {
    navigate(`/card-history/${cardId}`);
  };

  return (
    <div className="space-y-8">
      {/* Статистика */}
      <StatsOverview
        totalBalance={totalBalance}
        totalCards={cards.length}
        recentTransactions={recentTransactions.length}
      />

      {/* Сетка карточек */}
      <CardGrid
        cards={cards}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onQuickTransaction={handleQuickTransaction}
        onViewHistory={handleViewHistory}
        onAddCard={handleAddCard}
      />
    </div>
  );
};
