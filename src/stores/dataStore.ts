import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FinanceCard,
  Transaction,
  UserSettings,
  SyncStatus,
  CardFormData,
  TransactionFormData,
  AppData,
} from "../types";
import { createGitHubGistService } from "../services/GitHubGistService";
import { useAuthStore } from "./authStore";

interface DataState {
  cards: FinanceCard[];
  transactions: Transaction[];
  settings: UserSettings;
  syncStatus: SyncStatus;
  lastSyncTime: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface DataActions {
  // Управление карточками
  addCard: (cardData: CardFormData) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<FinanceCard>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;

  // Управление транзакциями
  addTransaction: (
    cardId: string,
    transactionData: TransactionFormData
  ) => Promise<void>;
  updateTransaction: (
    transactionId: string,
    updates: Partial<Transaction>
  ) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;

  // Синхронизация
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;

  // Утилитарные методы
  calculateCardBalance: (cardId: string) => number;
  getTotalBalance: () => number;
  getTransactionsByCard: (cardId: string) => Transaction[];
  getCardById: (cardId: string) => FinanceCard | undefined;
  getRecentTransactions: (limit?: number) => Transaction[];

  // Настройки
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Очистка данных
  clearData: () => void;
  setError: (error: string | null) => void;
}

type DataStore = DataState & DataActions;

const defaultSettings: UserSettings = {
  currency: "RUB",
  dateFormat: "DD.MM.YYYY",
  autoSync: false,
  syncInterval: 30, // 30 минут
};

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Состояние
      cards: [],
      transactions: [],
      settings: defaultSettings,
      syncStatus: "idle",
      lastSyncTime: null,
      isLoading: false,
      error: null,

      // Действия с карточками
      addCard: async (cardData: CardFormData) => {
        set({ isLoading: true, error: null });

        try {
          const newCard: FinanceCard = {
            id: crypto.randomUUID(),
            name: cardData.name,
            balance: cardData.balance,
            color: cardData.color,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            cards: [...state.cards, newCard],
            isLoading: false,
          }));

          // Автосинхронизация если включена
          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      updateCard: async (cardId: string, updates: Partial<FinanceCard>) => {
        set({ isLoading: true, error: null });

        try {
          set((state) => ({
            cards: state.cards.map((card) =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date() }
                : card
            ),
            isLoading: false,
          }));

          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      deleteCard: async (cardId: string) => {
        set({ isLoading: true, error: null });

        try {
          set((state) => ({
            cards: state.cards.filter((card) => card.id !== cardId),
            transactions: state.transactions.filter(
              (transaction) => transaction.cardId !== cardId
            ),
            isLoading: false,
          }));

          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      // Действия с транзакциями
      addTransaction: async (
        cardId: string,
        transactionData: TransactionFormData
      ) => {
        set({ isLoading: true, error: null });

        try {
          const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            cardId,
            amount: transactionData.amount,
            type: transactionData.type,
            description: transactionData.description,
            date: new Date(),
            createdAt: new Date(),
          };

          set((state) => ({
            transactions: [...state.transactions, newTransaction],
            isLoading: false,
          }));

          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      updateTransaction: async (
        transactionId: string,
        updates: Partial<Transaction>
      ) => {
        set({ isLoading: true, error: null });

        try {
          set((state) => ({
            transactions: state.transactions.map((transaction) =>
              transaction.id === transactionId
                ? { ...transaction, ...updates }
                : transaction
            ),
            isLoading: false,
          }));

          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      deleteTransaction: async (transactionId: string) => {
        set({ isLoading: true, error: null });

        try {
          set((state) => ({
            transactions: state.transactions.filter(
              (transaction) => transaction.id !== transactionId
            ),
            isLoading: false,
          }));

          const { settings } = get();
          const { isGitHubConfigured } = useAuthStore.getState();
          if (settings.autoSync && isGitHubConfigured()) {
            await get().syncToCloud();
          }
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      // Синхронизация
      syncToCloud: async () => {
        const { user, getGitHubToken, getGitHubGistId, updateGitHubSettings } = useAuthStore.getState();
        
        if (!user) {
          set({ error: "Пользователь не авторизован" });
          return;
        }
        
        const githubToken = getGitHubToken();
        if (!githubToken) {
          set({ error: "GitHub токен не настроен для данного аккаунта" });
          return;
        }

        set({ syncStatus: "syncing" });

        try {
          const gistService = createGitHubGistService(
            githubToken,
            getGitHubGistId()
          );

          const { cards, transactions, settings } = get();
          const appData: AppData = {
            cards,
            transactions,
            settings,
            version: "1.0.0",
            lastSyncTime: new Date(),
          };

          const gistId = await gistService.saveAppData(appData);

          // Обновляем gistId в настройках пользователя если это новый Gist
          if (!getGitHubGistId()) {
            updateGitHubSettings({ gistId, lastSyncTime: new Date() });
          } else {
            updateGitHubSettings({ lastSyncTime: new Date() });
          }

          set({
            syncStatus: "success",
            lastSyncTime: new Date(),
            error: null,
          });
        } catch (error) {
          set({ syncStatus: "error", error: String(error) });
        }
      },

      syncFromCloud: async () => {
        const { user, getGitHubToken, getGitHubGistId, updateGitHubSettings } = useAuthStore.getState();
        
        if (!user) {
          set({ error: "Пользователь не авторизован" });
          return;
        }
        
        const githubToken = getGitHubToken();
        const githubGistId = getGitHubGistId();
        
        if (!githubToken || !githubGistId) {
          set({ error: "GitHub токен или Gist ID не настроены для данного аккаунта" });
          return;
        }

        set({ syncStatus: "syncing" });

        try {
          const gistService = createGitHubGistService(githubToken, githubGistId);
          const appData = await gistService.loadAppData();

          // Преобразуем строковые даты обратно в объекты Date
          const cards = appData.cards.map((card) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            updatedAt: new Date(card.updatedAt),
          }));

          const transactions = appData.transactions.map((transaction) => ({
            ...transaction,
            date: new Date(transaction.date),
            createdAt: new Date(transaction.createdAt),
          }));

          // Обновляем время последней синхронизации в настройках пользователя
          updateGitHubSettings({ lastSyncTime: new Date(appData.lastSyncTime) });

          set({
            cards,
            transactions,
            settings: { ...get().settings, ...appData.settings },
            syncStatus: "success",
            lastSyncTime: new Date(appData.lastSyncTime),
            error: null,
          });
        } catch (error) {
          set({ syncStatus: "error", error: String(error) });
        }
      },

      setSyncStatus: (status: SyncStatus) => {
        set({ syncStatus: status });
      },

      // Утилитарные методы
      calculateCardBalance: (cardId: string) => {
        const { transactions } = get();
        const cardTransactions = transactions.filter(
          (t) => t.cardId === cardId
        );

        const card = get().cards.find((c) => c.id === cardId);
        const initialBalance = card?.balance || 0;

        const transactionSum = cardTransactions.reduce((sum, transaction) => {
          return transaction.type === "income"
            ? sum + transaction.amount
            : sum - transaction.amount;
        }, 0);

        return initialBalance + transactionSum;
      },

      getTotalBalance: () => {
        const { cards } = get();
        return cards.reduce((total, card) => {
          return total + get().calculateCardBalance(card.id);
        }, 0);
      },

      getTransactionsByCard: (cardId: string) => {
        const { transactions } = get();
        return transactions
          .filter((transaction) => transaction.cardId === cardId)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },

      getCardById: (cardId: string) => {
        const { cards } = get();
        return cards.find((card) => card.id === cardId);
      },

      getRecentTransactions: (limit = 5) => {
        const { transactions } = get();
        return transactions
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      },

      // Настройки
      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // Очистка данных
      clearData: () => {
        set({
          cards: [],
          transactions: [],
          settings: defaultSettings,
          syncStatus: "idle",
          lastSyncTime: null,
          error: null,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "balance-data-storage",
      partialize: (state) => ({
        cards: state.cards,
        transactions: state.transactions,
        settings: state.settings,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
