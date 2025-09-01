import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useUIStore } from "../../stores/uiStore";
import { useDataStore } from "../../stores/dataStore";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../stores/uiStore";

export const QuickTransactionModal: React.FC = () => {
  const { modals, closeModal } = useUIStore();
  const { addTransaction, getCardById, isLoading } = useDataStore();

  const [formData, setFormData] = useState({
    amount: "",
    type: "income" as "income" | "expense",
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isOpen = modals.quickTransaction.isOpen;
  const cardId = modals.quickTransaction.cardId;
  const card = cardId ? getCardById(cardId) : null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount) {
      newErrors.amount = "Сумма обязательна";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Сумма должна быть положительным числом";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание операции обязательно";
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
      await addTransaction(cardId, {
        amount: Number(formData.amount),
        type: formData.type,
        description: formData.description.trim(),
      });

      const operationType = formData.type === "income" ? "Доход" : "Расход";
      showSuccessNotification(
        "Операция добавлена",
        `${operationType} ${formData.amount} ₽ успешно добавлен`
      );

      handleClose();
    } catch (error) {
      showErrorNotification(
        "Ошибка добавления",
        "Не удалось добавить операцию. Попробуйте ещё раз."
      );
    }
  };

  const handleClose = () => {
    setFormData({
      amount: "",
      type: "income",
      description: "",
    });
    setErrors({});
    closeModal("quickTransaction");
  };

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type }));
  };

  if (!card) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Новая операция: ${card.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Тип операции */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-3">
            Тип операции
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`p-4 rounded-lg transition-all ${
                formData.type === "income"
                  ? "bg-green-400 bg-opacity-10 scale-105"
                  : "hover:scale-105"
              }`}
              disabled={isLoading}
            >
              <Plus className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-dark-text">Доход</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`p-4 rounded-lg transition-all ${
                formData.type === "expense"
                  ? "bg-red-400 bg-opacity-10 scale-105"
                  : "hover:scale-105"
              }`}
              disabled={isLoading}
            >
              <Minus className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-dark-text">Расход</span>
            </button>
          </div>
        </div>

        {/* Сумма */}
        <div>
          <label
            htmlFor="transactionAmount"
            className="block text-sm font-medium text-dark-text mb-2"
          >
            Сумма *
          </label>
          <input
            id="transactionAmount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className={`input-field w-full ${errors.amount ? "border-red-400" : ""}`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Описание */}
        <div>
          <label
            htmlFor="transactionDescription"
            className="block text-sm font-medium text-dark-text mb-2"
          >
            Описание операции *
          </label>
          <input
            id="transactionDescription"
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className={`input-field w-full ${errors.description ? "border-red-400" : ""}`}
            placeholder={
              formData.type === "income"
                ? "Например: Зарплата, Подарок"
                : "Например: Продукты, Транспорт"
            }
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Информация о текущем балансе */}
        <div className="p-4 bg-dark-surface-variant rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-dark-text-secondary">Текущий баланс:</span>
            <span className="font-medium text-dark-text">
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(card.balance)}
            </span>
          </div>
          {formData.amount && !isNaN(Number(formData.amount)) && (
            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-dark-border">
              <span className="text-dark-text-secondary">После операции:</span>
              <span
                className={`font-medium ${
                  formData.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(
                  card.balance +
                    (formData.type === "income"
                      ? Number(formData.amount)
                      : -Number(formData.amount))
                )}
              </span>
            </div>
          )}
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
            className={`flex-1 disabled:opacity-50 ${
              formData.type === "income"
                ? "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                : "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? "Добавление..."
              : `Добавить ${formData.type === "income" ? "доход" : "расход"}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
