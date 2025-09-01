// Основные типы для финансовых карточек
export interface FinanceCard {
  id: string;
  name: string;
  balance: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для транзакций
export interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  date: Date;
  createdAt: Date;
}

// Типы для пользователя
export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  picture?: string;
  provider?: "demo" | "google";
  googleId?: string;
  // GitHub Gist settings linked to this user account
  githubSettings?: {
    token?: string;
    gistId?: string;
    autoSync?: boolean;
    lastSyncTime?: Date;
  };
}

// Типы для авторизации
export interface LoginCredentials {
  username: string;
  password: string;
}

// Типы для Google OAuth
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthResponse {
  credential: string;
  clientId: string;
}

// Типы для настроек пользователя (общие настройки приложения)
export interface UserSettings {
  currency: string;
  dateFormat: string;
  autoSync: boolean;
  syncInterval: number; // в минутах
}

// Типы для уведомлений
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number; // в миллисекундах
}

// Типы для состояния синхронизации
export type SyncStatus = "idle" | "syncing" | "success" | "error";

// Типы для состояния загрузки
export interface LoadingState {
  global: boolean;
  cardActions: boolean;
  sync: boolean;
  transactions: boolean;
}

// Типы для модальных окон
export interface ModalState {
  addCard: boolean;
  editCard: { isOpen: boolean; cardId?: string };
  quickTransaction: { isOpen: boolean; cardId?: string };
  deleteConfirmation: {
    isOpen: boolean;
    cardId?: string;
    type?: "card" | "transaction";
    itemId?: string;
  };
}

// Типы для данных приложения (для синхронизации)
export interface AppData {
  cards: FinanceCard[];
  transactions: Transaction[];
  settings: UserSettings;
  version: string;
  lastSyncTime: Date;
}

// Типы для ответа GitHub Gist API
export interface GitHubGistResponse {
  id: string;
  files: {
    [filename: string]: {
      content: string;
    };
  };
  created_at: string;
  updated_at: string;
}

// Цвета для карточек
export const CARD_COLORS = [
  { name: "Синий", value: "#112533", class: "bg-card-blue" },
  { name: "Зелёный", value: "#263d26", class: "bg-card-green" },
  { name: "Фиолетовый", value: "#3c1c41", class: "bg-card-purple" },
  { name: "Оранжевый", value: "#463822", class: "bg-card-orange" },
  { name: "Розовый", value: "#361a24", class: "bg-card-pink" },
  { name: "Жёлтый", value: "#353214", class: "bg-card-yellow" },
  { name: "Красный", value: "#3f0d14", class: "bg-card-red" },
  { name: "Бирюзовый", value: "#1c3534", class: "bg-card-teal" },
] as const;

// Типы для пропсов компонентов
export interface FinanceCardComponentProps {
  card: FinanceCard;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  onQuickTransaction: (cardId: string) => void;
  onViewHistory: (cardId: string) => void;
}

export interface CardGridProps {
  cards: FinanceCard[];
  onEditCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onQuickTransaction: (cardId: string) => void;
  onViewHistory: (cardId: string) => void;
  onAddCard: () => void;
}

export interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction?: (transactionId: string) => void;
  onDeleteTransaction?: (transactionId: string) => void;
}

export interface StatsOverviewProps {
  totalBalance: number;
  totalCards: number;
  recentTransactions: number;
}

// Типы для форм
export interface CardFormData {
  name: string;
  balance: number;
  color: string;
}

export interface TransactionFormData {
  amount: number;
  type: "income" | "expense";
  description: string;
}

// Типы для фильтрации и сортировки
export interface TransactionFilters {
  type?: "income" | "expense" | "all";
  dateFrom?: Date;
  dateTo?: Date;
  cardId?: string;
}

export interface SortOption {
  field: "date" | "amount" | "description";
  direction: "asc" | "desc";
}
