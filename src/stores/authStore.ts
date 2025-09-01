import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginCredentials, GoogleAuthResponse } from "../types";
import GoogleAuthService from "../services/GoogleAuthService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (response: GoogleAuthResponse) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeGoogleAuth: () => Promise<void>;
  
  // GitHub Gist settings management
  updateGitHubSettings: (settings: Partial<User['githubSettings']>) => void;
  getGitHubToken: () => string | undefined;
  getGitHubGistId: () => string | undefined;
  isGitHubConfigured: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Состояние
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Действия
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Симуляция задержки для реалистичности
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Простая проверка фиксированных учётных данных
          if (
            credentials.username === "user" &&
            credentials.password === "pass"
          ) {
            const user: User = {
              id: "1",
              username: credentials.username,
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Неверные учётные данные");
          }
        } catch (error) {
          set({
            error: String(error),
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      // Google авторизация
      loginWithGoogle: async (response: GoogleAuthResponse) => {
        set({ isLoading: true, error: null });

        try {
          const googleUser = GoogleAuthService.parseJWT(response.credential);
          
          if (!googleUser) {
            throw new Error('Не удалось получить данные пользователя из Google');
          }

          const user: User = {
            id: googleUser.id,
            username: googleUser.name,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            provider: 'google',
            googleId: googleUser.id,
          };

          // Debug logging to check what user data is being stored
          console.log('[AuthStore] Google user data:', {
            googleUser,
            createdUser: user,
            hasPicture: !!user.picture,
            pictureUrl: user.picture
          });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: String(error),
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      logout: () => {
        // Выйти из Google если пользователь входил через Google
        GoogleAuthService.signOut();
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        // Очистка других store при выходе
        localStorage.removeItem("balance-data-storage");
        localStorage.removeItem("balance-ui-storage");
      },

      clearError: () => {
        set({ error: null });
      },

      // Инициализация Google Auth
      initializeGoogleAuth: async () => {
        try {
          await GoogleAuthService.initialize();
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error);
        }
      },

      // GitHub Gist settings management
      updateGitHubSettings: (settings: Partial<User['githubSettings']>) => {
        set((state) => {
          if (!state.user) return state;
          
          const updatedUser = {
            ...state.user,
            githubSettings: {
              ...state.user.githubSettings,
              ...settings,
            }
          };
          
          return { user: updatedUser };
        });
      },

      getGitHubToken: (): string | undefined => {
        const state = get();
        return state.user?.githubSettings?.token;
      },

      getGitHubGistId: (): string | undefined => {
        const state = get();
        return state.user?.githubSettings?.gistId;
      },

      isGitHubConfigured: () => {
        const state = get();
        return !!(state.user?.githubSettings?.token && state.user.githubSettings.token.trim() !== '');
      },
    }),
    {
      name: "balance-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
