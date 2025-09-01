import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Wallet, RefreshCw, User } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useDataStore } from "../../stores/dataStore";
import type { User as UserType } from "../../types";

// UserAvatar component with proper image fallback handling
const UserAvatar: React.FC<{ user: UserType | null }> = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  // Show fallback avatar if no user, no picture, not Google provider, or image failed to load
  if (!user || !user.picture || user.provider !== "google" || imageError) {
    return (
      <div
        className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
        }}
        title={user?.name || user?.username || "Пользователь"}
      >
        {user?.name || user?.username ? (
          <span className="text-white font-semibold text-base">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="h-6 w-6 text-white" />
        )}
      </div>
    );
  }

  // Show Google profile picture
  return (
    <img
      src={user.picture}
      alt={user.name || user.username}
      className="w-12 h-12 rounded-full border-2 border-secondary shadow-lg transition-transform hover:scale-105"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { getTotalBalance, syncToCloud, syncStatus } = useDataStore();
  const navigate = useNavigate();

  // Debug logging to check user data in Header
  React.useEffect(() => {
    if (user) {
      console.log("[Header] Current user data:", {
        user,
        provider: user.provider,
        hasPicture: !!user.picture,
        pictureUrl: user.picture,
      });
    }
  }, [user]);

  const totalBalance = getTotalBalance();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSync = async () => {
    await syncToCloud();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  return (
    <header
      className="bg-surface border-b border-primary px-6 py-4 backdrop-blur-md"
      style={{ marginBottom: "var(--space-6)" }}
    >
      <div className="flex items-center justify-between">
        {/* Логотип и название */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-4 bg-surface-secondary hover:bg-surface-hover rounded-xl px-4 py-3 group transition-all duration-300 interactive"
          title="Перейти на главную страницу"
        >
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
            }}
          >
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-primary group-hover:gradient-text transition-colors">
              Balance
            </h1>
            <p className="text-sm text-tertiary">Управление финансами</p>
          </div>
        </button>

        {/* Общий баланс */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="text-center bg-surface-secondary rounded-xl px-6 py-4 border border-secondary">
            <p className="text-sm text-tertiary mb-1">Общий баланс</p>
            <p
              className={`text-3xl font-bold ${
                totalBalance >= 0 ? "text-success" : "text-error"
              }`}
            >
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Действия пользователя */}
        <div className="flex items-center space-x-3">
          {/* Кнопка синхронизации */}
          <button
            onClick={handleSync}
            disabled={syncStatus === "syncing"}
            className="btn btn-secondary btn-icon-lg glass disabled:opacity-50 transition-all duration-300"
            title="Синхронизировать с облаком"
          >
            <RefreshCw
              className={`h-5 w-5 ${
                syncStatus === "syncing" ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline ml-2">
              {syncStatus === "syncing" ? "Синхронизация..." : "Синхронизация"}
            </span>
          </button>

          {/* Кнопка настроек */}
          <button
            onClick={() => navigate("/settings")}
            className="btn btn-secondary btn-icon-lg glass"
            title="Настройки"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Информация о пользователе и выход */}
          <div className="flex items-center space-x-4">
            {/* Аватар пользователя */}
            <div className="relative">
              <UserAvatar user={user} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-surface rounded-full animate-pulse"></div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-primary">
                {user?.name || user?.username}
              </p>
              {user?.provider === "google" && user?.email ? (
                <p className="text-xs text-tertiary">{user.email}</p>
              ) : (
                <p className="text-xs text-success font-medium">Онлайн</p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-icon-lg text-error hover:text-error hover:bg-error/10"
              title="Выйти"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильный баланс */}
      <div className="md:hidden mt-6">
        <div className="bg-surface-secondary rounded-xl p-4 border border-secondary text-center">
          <p className="text-sm text-tertiary mb-2">Общий баланс</p>
          <p
            className={`text-2xl font-bold ${
              totalBalance >= 0 ? "text-success" : "text-error"
            }`}
          >
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>
    </header>
  );
};
