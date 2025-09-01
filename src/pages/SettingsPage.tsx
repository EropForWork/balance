import React, { useState, useEffect } from "react";
import {
  Save,
  Github,
  Database,
  Download,
  Upload,
} from "lucide-react";
import { useDataStore } from "../stores/dataStore";
import { useAuthStore } from "../stores/authStore";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../stores/uiStore";

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, syncToCloud, syncFromCloud, syncStatus } =
    useDataStore();
  const {
    user,
    updateGitHubSettings,
    getGitHubToken,
    getGitHubGistId,
    isGitHubConfigured,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    githubToken: "",
    githubGistId: "",
    autoSync: settings.autoSync,
    syncInterval: settings.syncInterval,
  });

  // Инициализация данных формы из аккаунта пользователя
  useEffect(() => {
    if (user) {
      setFormData({
        githubToken: getGitHubToken() || "",
        githubGistId: getGitHubGistId() || "",
        autoSync: settings.autoSync,
        syncInterval: settings.syncInterval,
      });
    }
  }, [
    user,
    getGitHubToken,
    getGitHubGistId,
    settings.autoSync,
    settings.syncInterval,
  ]);

  const handleSave = () => {
    // Сохраняем GitHub настройки в аккаунте пользователя
    updateGitHubSettings({
      token: formData.githubToken.trim() || undefined,
      gistId: formData.githubGistId.trim() || undefined,
    });

    // Сохраняем общие настройки приложения
    updateSettings({
      autoSync: formData.autoSync,
      syncInterval: formData.syncInterval,
    });

    showSuccessNotification(
      "Настройки сохранены",
      `Настройки для аккаунта ${user?.name || user?.username} успешно обновлены`
    );
  };

  const handleSyncToCloud = async () => {
    try {
      await syncToCloud();
      showSuccessNotification(
        "Синхронизация завершена",
        "Данные успешно сохранены в облаке"
      );
    } catch (error) {
      showErrorNotification(
        "Ошибка синхронизации",
        "Не удалось синхронизировать данные"
      );
    }
  };

  const handleSyncFromCloud = async () => {
    try {
      await syncFromCloud();
      showSuccessNotification(
        "Синхронизация завершена",
        "Данные успешно загружены из облака"
      );
    } catch (error) {
      showErrorNotification(
        "Ошибка синхронизации",
        "Не удалось загрузить данные из облака"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-text">Настройки</h1>
            <p className="text-dark-text-secondary">
              Управление синхронизацией и конфигурацией приложения
            </p>
          </div>
        </div>
      </div>

      {/* Информация о пользователе */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || user.username}
              className="w-12 h-12 rounded-full border-2 border-dark-border"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-blue-primary)" }}
            >
              <span className="text-white font-semibold text-lg">
                {(user?.name || user?.username)?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-dark-text">
              {user?.name || user?.username}
            </h2>
            <p className="text-dark-text-secondary">
              {user?.email}{" "}
              {user?.provider === "google" ? "(Google)" : "(Demo)"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-dark-text-secondary">Идентификатор:</span>
            <p className="text-dark-text font-mono">{user?.id}</p>
          </div>
          <div>
            <span className="text-dark-text-secondary">GitHub настройки:</span>
            <p
              className={`text-sm ${
                isGitHubConfigured() ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {isGitHubConfigured() ? "Настроено" : "Не настроено"}
            </p>
          </div>
        </div>
      </div>

      {/* GitHub синхронизация */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Github className="h-6 w-6 text-dark-text" />
          <h2 className="text-xl font-semibold text-dark-text">
            Синхронизация с GitHub Gist
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="githubToken"
              className="block text-sm font-medium text-dark-text mb-2"
            >
              GitHub Personal Access Token
            </label>
            <input
              id="githubToken"
              type="password"
              value={formData.githubToken}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  githubToken: e.target.value,
                }))
              }
              className="input-field w-full"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-sm text-dark-text-secondary mt-1">
              Токен для доступа к GitHub API. Требуются права на создание и
              редактирование Gist.
            </p>
          </div>

          <div>
            <label
              htmlFor="githubGistId"
              className="block text-sm font-medium text-dark-text mb-2"
            >
              GitHub Gist ID (опционально)
            </label>
            <input
              id="githubGistId"
              type="text"
              value={formData.githubGistId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  githubGistId: e.target.value,
                }))
              }
              className="input-field w-full"
              placeholder="Автоматически создастся при первой синхронизации"
            />
            <p className="text-sm text-dark-text-secondary mt-1">
              ID существующего Gist для синхронизации. Оставьте пустым для
              создания нового.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="autoSync"
              type="checkbox"
              checked={formData.autoSync}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, autoSync: e.target.checked }))
              }
              className="h-4 w-4 rounded border-dark-border bg-dark-surface-variant"
              style={{ color: "var(--color-blue-accent)" }}
            />
            <label
              htmlFor="autoSync"
              className="text-sm font-medium text-dark-text"
            >
              Автоматическая синхронизация
            </label>
          </div>

          {formData.autoSync && (
            <div>
              <label
                htmlFor="syncInterval"
                className="block text-sm font-medium text-dark-text mb-2"
              >
                Интервал синхронизации (минуты)
              </label>
              <input
                id="syncInterval"
                type="number"
                min="5"
                max="1440"
                value={formData.syncInterval}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    syncInterval: Number(e.target.value),
                  }))
                }
                className="input-field w-32"
              />
            </div>
          )}
        </div>
      </div>

      {/* Управление данными */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-6 w-6 text-dark-text" />
          <h2 className="text-xl font-semibold text-dark-text">
            Управление данными
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleSyncToCloud}
            disabled={syncStatus === "syncing" || !isGitHubConfigured()}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>
              {syncStatus === "syncing"
                ? "Синхронизация..."
                : "Загрузить в облако"}
            </span>
          </button>

          <button
            onClick={handleSyncFromCloud}
            disabled={
              syncStatus === "syncing" ||
              !isGitHubConfigured() ||
              !getGitHubGistId()
            }
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>
              {syncStatus === "syncing"
                ? "Синхронизация..."
                : "Загрузить из облака"}
            </span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-dark-surface-variant rounded-lg">
          <h3 className="text-sm font-medium text-dark-text mb-2">
            Статус синхронизации
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                syncStatus === "success"
                  ? "bg-green-400"
                  : syncStatus === "error"
                    ? "bg-red-400"
                    : syncStatus === "syncing"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-dark-text-secondary">
              {syncStatus === "success" &&
                "Последняя синхронизация прошла успешно"}
              {syncStatus === "error" && "Ошибка при последней синхронизации"}
              {syncStatus === "syncing" && "Выполняется синхронизация..."}
              {syncStatus === "idle" && "Синхронизация не выполнялась"}
            </span>
          </div>
        </div>
      </div>

      {/* Информация о приложении */}
      <div className="card">
        <h2 className="text-xl font-semibold text-dark-text mb-4">
          О приложении
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Версия:</span>
            <span className="text-dark-text font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Технологии:</span>
            <span className="text-dark-text font-medium">
              React + TypeScript + Vite
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Хранение данных:</span>
            <span className="text-dark-text font-medium">
              Локально + GitHub Gist
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка сохранения */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Сохранить настройки</span>
        </button>
      </div>
    </div>
  );
};
