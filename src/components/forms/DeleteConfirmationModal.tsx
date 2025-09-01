import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useUIStore } from "../../stores/uiStore";
import { useDataStore } from "../../stores/dataStore";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../stores/uiStore";

export const DeleteConfirmationModal: React.FC = () => {
  const { modals, closeModal } = useUIStore();
  const { deleteCard, getCardById, isLoading } = useDataStore();

  const isOpen = modals.deleteConfirmation.isOpen;
  const cardId = modals.deleteConfirmation.cardId;
  const type = modals.deleteConfirmation.type || "card";

  const card = cardId ? getCardById(cardId) : null;

  const handleConfirm = async () => {
    if (!cardId) return;

    try {
      if (type === "card") {
        await deleteCard(cardId);
        showSuccessNotification(
          "Карточка удалена",
          `Карточка "${card?.name}" успешно удалена`
        );
      }

      handleClose();
    } catch (error) {
      showErrorNotification(
        "Ошибка удаления",
        "Не удалось удалить карточку. Попробуйте ещё раз."
      );
    }
  };

  const handleClose = () => {
    closeModal("deleteConfirmation");
  };

  if (!card) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Подтверждение удаления"
      size="sm"
    >
      <div className="space-y-6">
        {/* Иконка предупреждения */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Текст предупреждения */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-dark-text mb-2">
            Вы уверены, что хотите удалить карточку?
          </h3>
          <p className="text-dark-text-secondary mb-4">
            Карточка{" "}
            <span className="font-medium text-dark-text">"{card.name}"</span>{" "}
            будет удалена безвозвратно.
          </p>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Внимание:</strong> Все операции, связанные с этой
              карточкой, также будут удалены. Это действие нельзя отменить.
            </p>
          </div>
        </div>

        {/* Информация о карточке */}
        <div className="p-4 bg-dark-surface-variant rounded-lg">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Название:</span>
              <span className="text-dark-text font-medium">{card.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Текущий баланс:</span>
              <span className="text-dark-text font-medium">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(card.balance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Создана:</span>
              <span className="text-dark-text font-medium">
                {new Intl.DateTimeFormat("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(card.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Удалить карточку</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
