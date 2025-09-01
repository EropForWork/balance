import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useUIStore } from "../../stores/uiStore";
import { useDataStore } from "../../stores/dataStore";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../stores/uiStore";
import { CARD_COLORS } from "../../types";

export const AddCardModal: React.FC = () => {
  const { modals, closeModal } = useUIStore();
  const { addCard, isLoading } = useDataStore();

  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    color: CARD_COLORS[0].value as string,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isOpen = modals.addCard;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название карточки обязательно";
    }

    if (!formData.balance) {
      newErrors.balance = "Начальный баланс обязателен";
    } else if (isNaN(Number(formData.balance))) {
      newErrors.balance = "Баланс должен быть числом";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await addCard({
        name: formData.name.trim(),
        balance: Number(formData.balance),
        color: formData.color,
      });

      showSuccessNotification(
        "Карточка создана",
        `Карточка "${formData.name}" успешно добавлена`
      );

      handleClose();
    } catch {
      showErrorNotification(
        "Ошибка создания",
        "Не удалось создать карточку. Попробуйте ещё раз."
      );
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      balance: "",
      color: CARD_COLORS[0].value as string,
    });
    setErrors({});
    closeModal("addCard");
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Добавить карточку"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Название карточки */}
        <div className="form-group">
          <label htmlFor="cardName" className="form-label">
            Название карточки *
          </label>
          <input
            id="cardName"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="Например: Карта Сбер, Наличные, Накопления"
            disabled={isLoading}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Начальный баланс */}
        <div className="form-group">
          <label htmlFor="cardBalance" className="form-label">
            Начальный баланс *
          </label>
          <input
            id="cardBalance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, balance: e.target.value }))
            }
            className={`input ${errors.balance ? "input-error" : ""}`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.balance && <p className="form-error">{errors.balance}</p>}
        </div>

        {/* Выбор цвета */}
        <div className="form-group">
          <label className="form-label mb-4">Цвет карточки</label>
          <div className="grid grid-cols-4 gap-4">
            {CARD_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => handleColorSelect(colorOption.value)}
                className={`h-16 rounded-xl transition-all duration-300 border-2 hover:scale-105 interactive ${
                  formData.color === colorOption.value
                    ? "border-white/50 scale-105 shadow-xl"
                    : "border-white/20 hover:border-white/40"
                }`}
                style={{ background: colorOption.value }}
                title={colorOption.name}
                disabled={isLoading}
              >
                {formData.color === colorOption.value && (
                  <div className="w-full h-full rounded-lg bg-black/20 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg animate-scale"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary btn-lg flex-1"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg flex-1 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full mr-2"></div>
                Создание...
              </>
            ) : (
              "Создать карточку"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
