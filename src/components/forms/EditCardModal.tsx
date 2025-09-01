import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useUIStore } from "../../stores/uiStore";
import { useDataStore } from "../../stores/dataStore";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../stores/uiStore";
import { CARD_COLORS } from "../../types";

export const EditCardModal: React.FC = () => {
  const { modals, closeModal } = useUIStore();
  const { updateCard, getCardById, isLoading } = useDataStore();

  const [formData, setFormData] = useState({
    name: "",
    color: CARD_COLORS[0].value as string,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isOpen = modals.editCard.isOpen;
  const cardId = modals.editCard.cardId;
  const card = cardId ? getCardById(cardId) : null;

  // Заполняем форму данными карточки при открытии
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        color: card.color,
      });
    }
  }, [card]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название карточки обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !cardId) {
      return;
    }

    try {
      await updateCard(cardId, {
        name: formData.name.trim(),
        color: formData.color,
      });

      showSuccessNotification(
        "Карточка обновлена",
        `Карточка "${formData.name}" успешно обновлена`
      );

      handleClose();
    } catch (error) {
      showErrorNotification(
        "Ошибка обновления",
        "Не удалось обновить карточку. Попробуйте ещё раз."
      );
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      color: CARD_COLORS[0].value as string,
    });
    setErrors({});
    closeModal("editCard");
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  if (!card) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать карточку"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Название карточки */}
        <div>
          <label
            htmlFor="editCardName"
            className="block text-sm font-medium text-dark-text mb-2"
          >
            Название карточки *
          </label>
          <input
            id="editCardName"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`input-field w-full ${errors.name ? "border-red-400" : ""}`}
            placeholder="Например: Карта Сбер, Наличные, Накопления"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Выбор цвета */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-3">
            Цвет карточки
          </label>
          <div className="grid grid-cols-4 gap-3">
            {CARD_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => handleColorSelect(colorOption.value)}
                className={`h-12 rounded-lg transition-all ${
                  formData.color === colorOption.value
                    ? "scale-105"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
                disabled={isLoading}
              >
                {formData.color === colorOption.value && (
                  <div className="w-full h-full rounded-md bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Информация о балансе */}
        <div className="p-4 bg-dark-surface-variant rounded-lg">
          <p className="text-sm text-dark-text-secondary mb-1">
            Текущий баланс (изменяется через операции):
          </p>
          <p className="text-lg font-semibold text-dark-text">
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
            }).format(card.balance)}
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
