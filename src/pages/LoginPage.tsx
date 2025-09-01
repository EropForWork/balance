import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, Eye, EyeOff, Wallet } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { showErrorNotification } from "../stores/uiStore";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import GoogleAuthService from "../services/GoogleAuthService";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError, initializeGoogleAuth } =
    useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем путь, куда нужно перенаправить после авторизации
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    // Инициализация Google Auth
    initializeGoogleAuth();
  }, [initializeGoogleAuth]);

  useEffect(() => {
    if (error) {
      showErrorNotification("Ошибка авторизации", error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showErrorNotification("Ошибка", "Заполните все поля");
      return;
    }

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch {
      // Ошибка уже обработана в store
    }
  };

  const handleGoogleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleGoogleError = (error: string) => {
    showErrorNotification("Ошибка Google авторизации", error);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <div
            className="mx-auto h-24 w-24 rounded-2xl flex items-center justify-center mb-8 shadow-xl animate-bounce"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
            }}
          >
            <Wallet className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-primary gradient-text mb-4">
            Добро пожаловать в Balance
          </h2>
          <p className="text-lg text-tertiary">
            Войдите в свой аккаунт для управления финансами
          </p>
        </div>

        {/* Google авторизация */}
        {GoogleAuthService.isConfigured() && (
          <div className="mt-8">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
              width="100%"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Разделитель */}
        <div
          className={`${GoogleAuthService.isConfigured() ? "mt-8" : "mt-6"} relative`}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-primary text-tertiary font-medium">
              {GoogleAuthService.isConfigured()
                ? "или войдите с помощью демо-аккаунта"
                : "Войдите с помощью демо-аккаунта"}
            </span>
          </div>
        </div>

        {/* Форма авторизации */}
        <div className="card bg-surface border border-secondary p-8 animate-slide-in-scale">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Поле имени пользователя */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Поле пароля */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input pr-12"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center btn btn-ghost btn-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-tertiary hover:text-secondary" />
                    ) : (
                      <Eye className="h-5 w-5 text-tertiary hover:text-secondary" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-3" />
                  Войти
                </>
              )}
            </button>
          </form>
        </div>

        {/* Демо-данные */}
        <div className="card bg-surface-secondary border border-secondary p-6">
          <h3 className="text-base font-semibold text-primary mb-3 flex items-center">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
            Демо-доступ:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-surface-tertiary rounded-lg p-3">
              <span className="font-medium text-secondary">Логин:</span>
              <p className="text-primary font-mono mt-1">user</p>
            </div>
            <div className="bg-surface-tertiary rounded-lg p-3">
              <span className="font-medium text-secondary">Пароль:</span>
              <p className="text-primary font-mono mt-1">pass</p>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center space-y-2">
          <p className="text-secondary text-sm">
            Это приложение для управления личными финансами.
          </p>
          <p className="text-tertiary text-xs">
            Ваши данные сохраняются локально и могут быть синхронизированы с
            GitHub Gist.
          </p>
          {!GoogleAuthService.isConfigured() && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-4">
              <p className="text-warning text-xs">
                🔍 Для использования Google авторизации необходимо настроить
                Google OAuth Client ID.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
