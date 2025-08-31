# Техническое задание веб-сайта для учёта личных финансов

## Обзор

Веб-приложение для управления личными финансами с возможностью отслеживания финансовых карточек и транзакций. Приложение обеспечивает авторизацию пользователей с фиксированными учётными данными и полноценный функционал управления карточками, включая отслеживание баланса, историю транзакций и кросс-платформенную доступность.

### Основные функции

- Авторизация пользователей с фиксированными учётными данными (user/pass)
- Управление финансовыми карточками (добавление, редактирование, удаление, настройка)
- Отслеживание баланса и запись транзакций
- История транзакций и детали операций
- Кросс-платформенный адаптивный дизайн (ПК, планшеты, смартфоны)
- Облачное хранение данных

### Технические требования

- Сборщик: Vite
- Frontend фреймворк: SolidJS (предпочтительно) или React
- Адаптивный дизайн для всех типов устройств
- Размещение на GitHub с понятной документацией
- Клиентское управление данными с облачной синхронизацией
- Кросс-устройственный доступ через GitHub Gist, Firebase или Google Drive

## Технологический стек и зависимости

### Основные технологии

```
- Сборщик: Vite
- Frontend фреймворк: SolidJS / React
- Стилизация: CSS3 с Flexbox/Grid
- Управление состоянием: SolidJS Store / React Context + useState
- Маршрутизация: @solidjs/router / React Router
- Иконки: Lucide Icons или Heroicons
- Выбор цвета: Пользовательский компонент или библиотека
```

### Зависимости разработки

```
- TypeScript для типобезопасности
- ESLint + Prettier для качества кода
- CSS Modules или Styled Components
- Vite плагины для оптимизации
```

### Стратегия хранения данных

```
- localStorage для локального хранения
- JSON структура для карточек и транзакций
- Облачная синхронизация через:
  - GitHub Gist API (для простого решения)
  - Google Drive API (файловое хранение)
  - Firebase Realtime Database (бесплатный тариф)
  - Dropbox API (файловое хранение)
- Функционал экспорта/импорта для переносимости данных
- Автоматическая синхронизация при входе в систему
- Offline-first подход с синхронизацией при подключении
```

## Архитектура компонентов

### Иерархия компонентов

```
graph TD
    A[App] --> B[AuthProvider]
    B --> C[Router]
    C --> D[LoginPage]
    C --> E[Dashboard]
    E --> F[Header]
    E --> G[CardList]
    E --> H[AddCardModal]
    G --> I[CardItem]
    I --> J[CardActions]
    C --> K[TransactionHistory]
    C --> L[AddTransactionModal]
    C --> M[EditCardModal]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style E fill:#e8f5e8
    style G fill:#fff3e0
```

### Описание компонентов

#### Основные компоненты

**Компонент App**

- Корневой компонент, управляющий глобальным состоянием
- Провайдер контекста авторизации
- Конфигурация маршрутизатора
- Глобальная обработка ошибок

**AuthProvider**

- Управление состоянием авторизации
- Функционал входа/выхода
- Защита маршрутов
- Сохранение сессии

**LoginPage**

- Форма входа с валидацией
- Проверка фиксированных учётных данных (user/pass)
- Адаптивный дизайн
- Обработка ошибок и обратная связь

**Dashboard**

- Основной интерфейс приложения
- Отображение списка карточек
- Кнопки быстрых действий
- Сводная статистика

#### Компоненты управления карточками

**CardList**

- Сеточная/списочная разметка карточек
- Адаптивное расположение карточек
- Состояния загрузки
- Обработка пустого состояния

**CardItem**

- Отображение отдельной карточки
- Информация о балансе и последней транзакции
- Настраиваемый фоновый цвет
- Кнопки действий (История, Редактирование)

**AddCardModal / EditCardModal**

- Форма для создания/редактирования карточки
- Валидация ввода названия
- Интеграция выбора цвета
- Ввод баланса с форматированием валюты

#### Компоненты транзакций

**TransactionHistory**

- Хронологический список транзакций
- Функционал фильтрации и поиска
- Индикаторы типов транзакций
- Пагинация или бесконечная прокрутка

**AddTransactionModal**

- Быстрый ввод транзакции
- Ввод суммы с валидацией
- Выбор типа транзакции (доход/расход)
- Выбор категории

### Props/State Management

#### Authentication State

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

#### Card State

```typescript
interface Card {
  id: string;
  name: string;
  backgroundColor: string;
  balance: number;
  lastTransaction?: Transaction;
  createdAt: Date;
  updatedAt: Date;
}

interface CardState {
  cards: Card[];
  addCard: (card: Omit<Card, "id">) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => Card | undefined;
}
```

#### Transaction State

```typescript
interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  description?: string;
  timestamp: Date;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  getTransactionsByCard: (cardId: string) => Transaction[];
  updateCardBalance: (
    cardId: string,
    amount: number,
    type: "income" | "expense"
  ) => void;
}
```

## Routing & Navigation

### Route Structure

```
/ - Landing/Login page (if not authenticated)
/dashboard - Main dashboard with card list
/card/:id/history - Transaction history for specific card
/card/:id/edit - Edit card details
/card/new - Add new card
/transaction/new/:cardId - Add new transaction
```

### Navigation Components

**Navigation Bar**

- Logo/brand
- User menu with logout
- Quick add card button
- Responsive hamburger menu for mobile

**Breadcrumb Navigation**

- Context-aware breadcrumbs
- Back navigation for mobile
- Clear hierarchy indication

## Styling Strategy

### Responsive Design Approach

**Breakpoints**

```css
/* Mobile first approach */
--mobile: 320px
--tablet: 768px
--desktop: 1024px
--large: 1440px
```

**Grid System**

```css
/* Card layout responsive grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }
}
```

### Design System

**Цветовая палитра (Тёмная тема с пастельными акцентами)**

``css
:root {
/_ Основные тёмные цвета _/
--bg-primary: #0f0f23; /_ Глубокий тёмно-синий фон _/
--bg-secondary: #1a1a2e; /_ Тёмно-серый для карточек _/
--bg-tertiary: #16213e; /_ Мягкий тёмно-синий для модалок _/
--surface: #252547; /_ Поверхности и элементы _/

/_ Пастельные акцентные цвета _/
--accent-lavender: #b794f6; /_ Мягкий лавандовый _/
--accent-mint: #9ae6b4; /_ Пастельный мятный _/
--accent-coral: #feb2b2; /_ Нежный коралловый _/
--accent-sky: #90cdf4; /_ Пастельный небесный _/
--accent-peach: #fbb6ce; /_ Мягкий персиковый _/
--accent-sage: #c6f6d5; /_ Пастельный шалфейный _/

/_ Основной акцентный цвет _/
--primary: #81e6d9; /_ Мягкий бирюзовый _/
--primary-hover: #4fd1c7; /_ Более яркий при наведении _/
--primary-light: #b2f5ea; /_ Светлый вариант _/

/_ Семантические цвета (пастельные) _/
--success: #9ae6b4; /_ Мягкий зелёный _/
--warning: #faf089; /_ Пастельный жёлтый _/
--error: #fc8181; /_ Мягкий красный _/
--info: #90cdf4; /_ Пастельный голубой _/

/_ Текстовые цвета _/
--text-primary: #f7fafc; /_ Основной текст - очень светлый _/
--text-secondary: #cbd5e0; /_ Вторичный текст - приглушённый _/
--text-muted: #a0aec0; /_ Третичный текст - тусклый _/
--text-disabled: #718096; /_ Отключённый текст _/

/_ Границы и разделители _/
--border-primary: #2d3748; /_ Основные границы _/
--border-secondary: #4a5568; /_ Вторичные границы _/
--border-focus: var(--primary); /_ Границы при фокусе _/

/_ Тени (мягкие тёмные) _/
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);

/_ Градиенты для карточек _/
--gradient-purple: linear-gradient(135deg, #b794f6 0%, #9f7aea 100%);
--gradient-blue: linear-gradient(135deg, #90cdf4 0%, #63b3ed 100%);
--gradient-green: linear-gradient(135deg, #9ae6b4 0%, #68d391 100%);
--gradient-coral: linear-gradient(135deg, #feb2b2 0%, #fc8181 100%);
--gradient-peach: linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%);
--gradient-mint: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
}

/_ Предустановленные пастельные цвета для карточек _/
.card-colors {
--lavender: #b794f6; /_ Лавандовый _/
--mint: #9ae6b4; /_ Мятный _/
--coral: #feb2b2; /_ Коралловый _/
--sky: #90cdf4; /_ Небесный _/
--peach: #fbb6ce; /_ Персиковый _/
--sage: #c6f6d5; /_ Шалфейный _/
--purple: #d8b4fe; /_ Фиолетовый _/
--blue: #93c5fd; /_ Голубой _/
--emerald: #6ee7b7; /_ Изумрудный _/
--pink: #f9a8d4; /_ Розовый _/
--amber: #fde68a; /_ Янтарный _/
--cyan: #67e8f9; /_ Циан _/
}

```

**Типографская шкала (Адаптированная для тёмной темы)**

``css
:root {
  /* Размеры шрифтов */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */
  --font-size-2xl: 1.5rem; /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem; /* 36px */

  /* Веса шрифтов */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Семейства шрифтов */
  --font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;

  /* Высота строк */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Интервалы */
  --space-unit: 0.25rem; /* 4px */
  --space-1: calc(var(--space-unit) * 1); /* 4px */
  --space-2: calc(var(--space-unit) * 2); /* 8px */
  --space-3: calc(var(--space-unit) * 3); /* 12px */
  --space-4: calc(var(--space-unit) * 4); /* 16px */
  --space-5: calc(var(--space-unit) * 5); /* 20px */
  --space-6: calc(var(--space-unit) * 6); /* 24px */
  --space-8: calc(var(--space-unit) * 8); /* 32px */
  --space-10: calc(var(--space-unit) * 10); /* 40px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */

  /* Радиусы скругления */
  --radius-sm: 0.375rem; /* 6px */
  --radius-md: 0.5rem; /* 8px */
  --radius-lg: 0.75rem; /* 12px */
  --radius-xl: 1rem; /* 16px */
  --radius-2xl: 1.5rem; /* 24px */
  --radius-full: 9999px; /* Полный круг */
}
```

### Component Styling

**Card Component Styling**

``css
.financial-card {
border-radius: 16px;
padding: 1.5rem;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
transition: transform 0.2s, box-shadow 0.2s;
background: var(--card-bg-color, #ffffff);
color: contrast-color(var(--card-bg-color));
}

.financial-card:hover {
transform: translateY(-2px);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

````

**Стилизация компонентов (Тёмная тема)**

**Глобальные стили**
```css
/* Основное оформление приложения */
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(183, 148, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(129, 230, 217, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(144, 205, 244, 0.1) 0%, transparent 50%);
  background-attachment: fixed;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}
````

**Финансовые карточки**

```
.financial-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.financial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card-bg-gradient, var(--gradient-purple));
  opacity: 0.1;
  z-index: 1;
}

.financial-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.financial-card:hover::before {
  opacity: 0.2;
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.card-balance {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary);
  margin: var(--space-4) 0;
  text-shadow: 0 0 20px rgba(129, 230, 217, 0.3);
}

.transaction-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
}

.transaction-indicator.expense {
  background: var(--error);
}
```

**Кнопки и элементы управления**

```css
.btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  border: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-hover) 100%
  );
  color: var(--bg-primary);
  box-shadow: 0 4px 15px rgba(129, 230, 217, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(129, 230, 217, 0.6);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary);
}
```

## State Management

### SolidJS State Management

```typescript
// Global state store
import { createStore } from "solid-js/store";

const [authStore, setAuthStore] = createStore({
  isAuthenticated: false,
  user: null,
});

const [cardsStore, setCardsStore] = createStore({
  cards: [],
  loading: false,
  error: null,
});

const [transactionsStore, setTransactionsStore] = createStore({
  transactions: [],
  loading: false,
});

// Context providers
export const AuthContext = createContext();
export const CardsContext = createContext();
export const TransactionsContext = createContext();
```

### React State Management Alternative

```typescript
// Context + Reducer pattern
interface AppState {
  auth: AuthState;
  cards: CardState;
  transactions: TransactionState;
}

const AppContext = createContext<AppState>();

// Custom hooks
export const useAuth = () => useContext(AppContext).auth;
export const useCards = () => useContext(AppContext).cards;
export const useTransactions = () => useContext(AppContext).transactions;
```

### Data Persistence Strategy

```typescript
// Local storage manager
class StorageManager {
  private static instance: StorageManager;

  saveCards(cards: Card[]): void {
    localStorage.setItem("finance_cards", JSON.stringify(cards));
  }

  loadCards(): Card[] {
    const stored = localStorage.getItem("finance_cards");
    return stored ? JSON.parse(stored) : [];
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
  }

  loadTransactions(): Transaction[] {
    const stored = localStorage.getItem("finance_transactions");
    return stored ? JSON.parse(stored) : [];
  }

  exportData(): string {
    return JSON.stringify({
      cards: this.loadCards(),
      transactions: this.loadTransactions(),
      exportDate: new Date().toISOString(),
    });
  }

  importData(data: string): void {
    const parsed = JSON.parse(data);
    this.saveCards(parsed.cards || []);
    this.saveTransactions(parsed.transactions || []);
  }
}
```

## Облачная синхронизация данных

### Варианты реализации кросс-устройственного доступа

#### GitHub Gist API (Основное решение)

**Преимущества:**

- ✅ Бесплатно и надёжно
- ✅ Простая реализация без сложной настройки
- ✅ Версионность данных (история изменений)
- ✅ Приватные gist'ы для безопасности
- ✅ Не требует сложной аутентификации
- ✅ REST API с понятной документацией

**Настройка:**

1. Создать GitHub аккаунт (если нет)
2. Сгенерировать Personal Access Token с правами gist
3. Создать приватный gist для хранения данных
4. Настроить конфигурацию в приложении

**Основная реализация GitHub Gist сервиса:**

``typescript
// Конфигурация GitHub Gist
interface GitHubConfig {
token: string; // Personal Access Token
gistId: string; // ID приватного gist'а
filename: string; // Имя файла в gist'е
}

class GitHubGistService {
private config: GitHubConfig;
private readonly BASE_URL = 'https://api.github.com/gists';

constructor(config: GitHubConfig) {
this.config = config;
}

// Сохранение данных в gist
async saveToCloud(data: FinanceData): Promise<void> {
try {
const payload = {
files: {
[this.config.filename]: {
content: JSON.stringify({
...data,
lastUpdated: new Date().toISOString(),
version: '1.0'
}, null, 2)
}
},
description: 'Личные финансы - Данные приложения'
};

      const response = await fetch(`${this.BASE_URL}/${this.config.gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`GitHub API ошибка: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Данные успешно сохранены в GitHub Gist');
    } catch (error) {
      console.error('❌ Ошибка сохранения в GitHub Gist:', error);
      throw error;
    }

}

// Загрузка данных из gist
async loadFromCloud(): Promise<FinanceData | null> {
try {
const response = await fetch(`${this.BASE_URL}/${this.config.gistId}`, {
headers: {
'Authorization': `Bearer ${this.config.token}`,
'Accept': 'application/vnd.github.v3+json'
}
});

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Gist не найден, создаём новый');
          return null;
        }
        throw new Error(`GitHub API ошибка: ${response.status}`);
      }

      const gist = await response.json();
      const fileContent = gist.files[this.config.filename]?.content;

      if (!fileContent) {
        console.warn('⚠️ Файл данных не найден в gist');
        return null;
      }

      const data = JSON.parse(fileContent);
      console.log('✅ Данные успешно загружены из GitHub Gist');
      return data;
    } catch (error) {
      console.error('❌ Ошибка загрузки из GitHub Gist:', error);
      throw error;
    }

}

// Создание нового gist'а (для первого запуска)
async createGist(initialData: FinanceData): Promise<string> {
try {
const payload = {
description: 'Личные финансы - Данные приложения',
public: false, // Приватный gist
files: {
[this.config.filename]: {
content: JSON.stringify({
...initialData,
createdAt: new Date().toISOString(),
version: '1.0'
}, null, 2)
}
}
};

      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ошибка создания gist: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Новый gist создан:', result.id);
      return result.id;
    } catch (error) {
      console.error('❌ Ошибка создания gist:', error);
      throw error;
    }

}

// Проверка подключения
async testConnection(): Promise<boolean> {
try {
const response = await fetch('https://api.github.com/user', {
headers: {
'Authorization': `Bearer ${this.config.token}`,
'Accept': 'application/vnd.github.v3+json'
}
});

      return response.ok;
    } catch (error) {
      return false;
    }

}
}

// Интерфейс данных
interface FinanceData {
cards: Card[];
transactions: Transaction[];
settings?: UserSettings;
lastUpdated?: string;
version?: string;
}

// Пример использования
const gistService = new GitHubGistService({
token: process.env.GITHUB_TOKEN || '',
gistId: process.env.GIST_ID || '',
filename: 'personal-finance-data.json'
});

// Сохранение данных
const saveData = async () => {
const data: FinanceData = {
cards: StorageManager.getInstance().loadCards(),
transactions: StorageManager.getInstance().loadTransactions()
};

await gistService.saveToCloud(data);
};

// Загрузка данных
const loadData = async () => {
const data = await gistService.loadFromCloud();

if (data) {
StorageManager.getInstance().saveCards(data.cards || []);
StorageManager.getInstance().saveTransactions(data.transactions || []);
}
};

````

#### Компонент настроек GitHub Gist

```typescript
interface GitHubSettings {
  token: string;
  gistId?: string;
  autoSync: boolean;
  syncInterval: number; // в минутах
}

const GitHubSettingsComponent = () => {
  const [settings, setSettings] = createSignal<GitHubSettings>({
    token: '',
    autoSync: true,
    syncInterval: 5
  });

  const [isConnected, setIsConnected] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [lastSync, setLastSync] = createSignal<Date | null>(null);

  // Проверка подключения к GitHub
  const testConnection = async () => {
    if (!settings().token) {
      showNotification('Введите GitHub Token', 'warning');
      return;
    }

    setLoading(true);
    try {
      const gistService = new GitHubGistService({
        token: settings().token,
        gistId: settings().gistId || '',
        filename: 'personal-finance-data.json'
      });

      const connected = await gistService.testConnection();
      setIsConnected(connected);

      if (connected) {
        showNotification('✅ Подключение к GitHub успешно!', 'success');

        // Если gist ID не указан, предложить создать новый
        if (!settings().gistId) {
          const shouldCreate = confirm('Создать новый приватный Gist для хранения данных?');

          if (shouldCreate) {
            await createNewGist();
          }
        }
      } else {
        showNotification('❌ Ошибка подключения к GitHub', 'error');
      }
    } catch (error) {
      showNotification('❌ Ошибка: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Создание нового Gist
  const createNewGist = async () => {
    try {
      const gistService = new GitHubGistService({
        token: settings().token,
        gistId: '',
        filename: 'personal-finance-data.json'
      });

      const initialData = {
        cards: StorageManager.getInstance().loadCards(),
        transactions: StorageManager.getInstance().loadTransactions()
      };

      const newGistId = await gistService.createGist(initialData);

      setSettings(prev => ({ ...prev, gistId: newGistId }));
      localStorage.setItem('github_gist_id', newGistId);

      showNotification(`✅ Gist создан: ${newGistId}`, 'success');
    } catch (error) {
      showNotification('❌ Ошибка создания Gist: ' + error.message, 'error');
    }
  };

  // Ручная синхронизация
  const syncNow = async () => {
    if (!isConnected() || !settings().gistId) {
      showNotification('Настройте подключение к GitHub', 'warning');
      return;
    }

    setLoading(true);
    try {
      const syncManager = SyncManager.getInstance();
      await syncManager.syncToCloud();
      await syncManager.syncFromCloud();

      setLastSync(new Date());
      showNotification('✅ Синхронизация завершена', 'success');
    } catch (error) {
      showNotification('❌ Ошибка синхронизации: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="sync-settings">
      <h3>Настройки GitHub Gist</h3>

      <div class="form-group">
        <label class="form-label">
          GitHub Personal Access Token
          <a href="https://github.com/settings/tokens" target="_blank" class="help-link">
            (как получить?)
          </a>
        </label>
        <input
          type="password"
          class="form-input"
          placeholder="ghp_xxxxxxxxxxxx"
          value={settings().token}
          onInput={(e) => setSettings(prev => ({ ...prev, token: e.target.value }))}
        />
        <small class="form-hint">
          Нужны права: gist (создание, чтение и редактирование gist'ов)
        </small>
      </div>

      <div class="form-group">
        <label class="form-label">Gist ID (опционально)</label>
        <input
          type="text"
          class="form-input"
          placeholder="Оставьте пустым для создания нового"
          value={settings().gistId || ''}
          onInput={(e) => setSettings(prev => ({ ...prev, gistId: e.target.value }))}
        />
      </div>

      <div class="connection-status">
        <div class={`status-indicator ${isConnected() ? 'connected' : 'disconnected'}`}>
          {isConnected() ? '✅ Подключено' : '❌ Не подключено'}
        </div>

        {lastSync() && (
          <div class="last-sync">
            Последняя синхронизация: {lastSync()?.toLocaleString('ru-RU')}
          </div>
        )}
      </div>

      <div class="sync-controls">
        <button
          class="btn btn-secondary"
          onClick={testConnection}
          disabled={loading()}
        >
          {loading() ? 'Проверка...' : 'Проверить подключение'}
        </button>

        <button
          class="btn btn-primary"
          onClick={syncNow}
          disabled={!isConnected() || loading()}
        >
          {loading() ? 'Синхронизация...' : 'Синхронизировать'}
        </button>
      </div>

      <div class="auto-sync-settings">
        <label class="checkbox-label">
          <input
            type="checkbox"
            checked={settings().autoSync}
            onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
          />
          Автоматическая синхронизация
        </label>

        <div class="form-group">
          <label class="form-label">Интервал синхронизации (минуты)</label>
          <input
            type="number"
            class="form-input"
            min="1"
            max="60"
            value={settings().syncInterval}
            onInput={(e) => setSettings(prev => ({ ...prev, syncInterval: parseInt(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  );
};
```

#### Обновлённый SyncManager для GitHub Gist

```typescript
class SyncManager {
  private static instance: SyncManager;
  private gistService: GitHubGistService | null = null;
  private lastSyncTime: number = 0;
  private syncInterval: number = 5 * 60 * 1000; // 5 минут
  private autoSyncEnabled: boolean = true;

  private constructor() {
    this.initializeFromStorage();
    this.setupAutoSync();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  // Инициализация из localStorage
  private initializeFromStorage(): void {
    const token = localStorage.getItem('github_token');
    const gistId = localStorage.getItem('github_gist_id');

    if (token && gistId) {
      this.gistService = new GitHubGistService({
        token,
        gistId,
        filename: 'personal-finance-data.json'
      });
    }
  }

  // Настройка GitHub Gist сервиса
  configureGitHub(token: string, gistId: string): void {
    this.gistService = new GitHubGistService({
      token,
      gistId,
      filename: 'personal-finance-data.json'
    });

    // Сохранение в localStorage
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_gist_id', gistId);
  }

  // Автоматическая синхронизация
  private setupAutoSync(): void {
    // Синхронизация при входе в приложение
    window.addEventListener('load', () => this.syncFromCloud());

    // Синхронизация при закрытии приложения
    window.addEventListener('beforeunload', () => this.syncToCloud());

    // Периодическая синхронизация
    setInterval(() => {
      if (this.autoSyncEnabled && this.gistService) {
        this.syncFromCloud();
      }
    }, this.syncInterval);

    // Синхронизация при возврате в приложение
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.autoSyncEnabled) {
        this.syncFromCloud();
      }
    });
  }

  // Сохранение в облако
  async syncToCloud(): Promise<void> {
    if (!this.gistService) {
      throw new Error('GitHub Gist не настроен');
    }

    try {
      const localData: FinanceData = {
        cards: StorageManager.getInstance().loadCards(),
        transactions: StorageManager.getInstance().loadTransactions(),
        lastUpdated: new Date().toISOString()
      };

      await this.gistService.saveToCloud(localData);
      this.lastSyncTime = Date.now();

      // Уведомление об успешной синхронизации
      this.dispatchSyncEvent('upload-success', localData);
    } catch (error) {
      console.error('Ошибка синхронизации в облако:', error);
      this.dispatchSyncEvent('upload-error', error);
      throw error;
    }
  }

  // Загрузка из облака
  async syncFromCloud(): Promise<void> {
    if (!this.gistService) {
      console.warn('GitHub Gist не настроен');
      return;
    }

    try {
      const cloudData = await this.gistService.loadFromCloud();

      if (cloudData && cloudData.lastUpdated) {
        const cloudTime = new Date(cloudData.lastUpdated).getTime();

        if (cloudTime > this.lastSyncTime) {
          // Облачные данные новее, обновляем локальные
          if (cloudData.cards) {
            StorageManager.getInstance().saveCards(cloudData.cards);
          }
          if (cloudData.transactions) {
            StorageManager.getInstance().saveTransactions(cloudData.transactions);
          }

          this.lastSyncTime = cloudTime;

          // Уведомляем интерфейс об обновлении
          this.dispatchSyncEvent('download-success', cloudData);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки из облака:', error);
      this.dispatchSyncEvent('download-error', error);
      // Не пробрасываем ошибку, приложение продолжает работать локально
    }
  }

  // Отправка событий синхронизации
  private dispatchSyncEvent(type: string, data: any): void {
    window.dispatchEvent(new CustomEvent('syncEvent', {
      detail: { type, data, timestamp: new Date() }
    }));
  }

  // Настройка автосинхронизации
  setAutoSync(enabled: boolean, intervalMinutes: number = 5): void {
    this.autoSyncEnabled = enabled;
    this.syncInterval = intervalMinutes * 60 * 1000;
  }

  // Проверка подключения
  async testConnection(): Promise<boolean> {
    if (!this.gistService) {
      return false;
    }

    return await this.gistService.testConnection();
  }

  // Получение информации о последней синхронизации
  getLastSyncInfo(): { time: Date | null; connected: boolean } {
    return {
      time: this.lastSyncTime ? new Date(this.lastSyncTime) : null,
      connected: this.gistService !== null
    };
  }
}
```

#### 2. Firebase Realtime Database

```typescript
// Firebase конфигурация (бесплатный тариф)
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

class FirebaseSyncService {
  private db = getDatabase();
  private userId = "user"; // фиксированный пользователь

  async saveToCloud(data: any): Promise<void> {
    await set(ref(this.db, `users/${this.userId}/finance`), {
      cards: data.cards,
      transactions: data.transactions,
      lastUpdated: Date.now(),
    });
  }

  async loadFromCloud(): Promise<any> {
    const snapshot = await get(ref(this.db, `users/${this.userId}/finance`));
    return snapshot.exists() ? snapshot.val() : null;
  }
}
````

#### 3. Google Drive API

```typescript
// Сохранение файла в Google Drive
class GoogleDriveSyncService {
  private static readonly CLIENT_ID = "your-google-client-id";

  async saveToCloud(data: any): Promise<void> {
    const fileContent = JSON.stringify(data);
    const metadata = {
      name: "personal-finance-data.json",
      parents: ["appDataFolder"], // скрытая папка приложения
    };

    // Используем Google Drive API v3
    await gapi.client.drive.files.create({
      resource: metadata,
      media: {
        mimeType: "application/json",
        body: fileContent,
      },
    });
  }
}
```

### Архитектура синхронизации

```
graph TB
A[Устройство 1] --> B[localStorage]
C[Устройство 2] --> D[localStorage]
E[Устройство 3] --> F[localStorage]

    B --> G[Sync Service]
    D --> G
    F --> G

    G --> H[GitHub Gist]
    G --> I[Firebase]
    G --> J[Google Drive]

    style G fill:#e1f5fe
    style H fill:#f3e5f5
    style I fill:#f3e5f5
    style J fill:#f3e5f5

```

### Стратегия синхронизации

#### Автоматическая синхронизация

```typescript
class SyncManager {
  private syncService: SyncService;
  private lastSyncTime: number = 0;

  constructor(syncService: SyncService) {
    this.syncService = syncService;
    this.setupAutoSync();
  }

  private setupAutoSync(): void {
    // Синхронизация при входе в приложение
    window.addEventListener("load", () => this.syncFromCloud());

    // Синхронизация при изменении данных
    window.addEventListener("beforeunload", () => this.syncToCloud());

    // Периодическая синхронизация (каждые 5 минут)
    setInterval(() => this.syncFromCloud(), 5 * 60 * 1000);

    // Синхронизация при возврате в приложение
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.syncFromCloud();
      }
    });
  }

  async syncToCloud(): Promise<void> {
    const localData = {
      cards: StorageManager.getInstance().loadCards(),
      transactions: StorageManager.getInstance().loadTransactions(),
      lastModified: Date.now(),
    };

    await this.syncService.saveToCloud(localData);
    this.lastSyncTime = Date.now();
  }

  async syncFromCloud(): Promise<void> {
    try {
      const cloudData = await this.syncService.loadFromCloud();

      if (cloudData && cloudData.lastModified > this.lastSyncTime) {
        // Облачные данные новее, обновляем локальные
        StorageManager.getInstance().saveCards(cloudData.cards || []);
        StorageManager.getInstance().saveTransactions(
          cloudData.transactions || []
        );
        this.lastSyncTime = cloudData.lastModified;

        // Уведомляем интерфейс об обновлении
        window.dispatchEvent(
          new CustomEvent("dataSync", { detail: cloudData })
        );
      }
    } catch (error) {
      console.warn("Синхронизация недоступна:", error);
      // Приложение продолжает работать в offline режиме
    }
  }

  async resolveConflicts(localData: any, cloudData: any): Promise<any> {
    // Простая стратегия: объединение по времени последнего изменения
    const mergedData = {
      cards: [...localData.cards, ...cloudData.cards].reduce((acc, card) => {
        const existing = acc.find((c) => c.id === card.id);
        if (!existing) {
          acc.push(card);
        } else if (card.updatedAt > existing.updatedAt) {
          acc[acc.indexOf(existing)] = card;
        }
        return acc;
      }, []),
      transactions: [
        ...localData.transactions,
        ...cloudData.transactions,
      ].filter(
        (transaction, index, arr) =>
          arr.findIndex((t) => t.id === transaction.id) === index
      ),
      lastModified: Math.max(localData.lastModified, cloudData.lastModified),
    };

    return mergedData;
  }
}
```

### Настройка синхронизации в приложении

#### Компонент настроек синхронизации

```
interface SyncSettings {
provider: "github" | "firebase" | "googledrive" | "none";
autoSync: boolean;
syncInterval: number; // в минутах
credentials?: {
token?: string;
apiKey?: string;
};
}

const SyncSettingsComponent = () => {
const [settings, setSettings] = createSignal<SyncSettings>({
provider: "none",
autoSync: true,
syncInterval: 5,
});

const handleProviderChange = (provider: string) => {
setSettings((prev) => ({ ...prev, provider }));
// Настройка соответствующего провайдера
};

const testConnection = async () => {
try {
await SyncManager.getInstance().testConnection();
showNotification("Подключение успешно!");
} catch (error) {
showNotification("Ошибка подключения: " + error.message);
}
};

return (
<div class="sync-settings">
<h3>Настройки синхронизации</h3>

      <div class="provider-selection">
        <label>Провайдер облачного хранения:</label>
        <select onChange={(e) => handleProviderChange(e.target.value)}>
          <option value="none">Только локально</option>
          <option value="github">GitHub Gist</option>
          <option value="firebase">Firebase</option>
          <option value="googledrive">Google Drive</option>
        </select>
      </div>

      <div class="sync-controls">
        <button onClick={testConnection}>Проверить подключение</button>
        <button onClick={() => SyncManager.getInstance().syncToCloud()}>
          Сохранить в облако
        </button>
        <button onClick={() => SyncManager.getInstance().syncFromCloud()}>
          Загрузить из облака
        </button>
      </div>
    </div>

);
};

```

### Преимущества каждого решения

#### GitHub Gist (Рекомендуется)

- ✅ Бесплатно и надежно
- ✅ Простая реализация
- ✅ Версионность данных
- ✅ Приватные gist'ы
- ❌ Требует GitHub аккаунт

#### Firebase Realtime Database

- ✅ Реальное время синхронизации
- ✅ Бесплатный тариф (1GB)
- ✅ Автоматическое разрешение конфликтов
- ❌ Требует настройку Firebase проекта

#### Google Drive API

- ✅ Большое бесплатное хранилище (15GB)
- ✅ Знакомый интерфейс для пользователей
- ✅ Автоматическое резервное копирование
- ❌ Более сложная настройка OAuth

### Резервное копирование и восстановление

```
class BackupService {
  exportData(): string {
    const data = {
      cards: StorageManager.getInstance().loadCards(),
      transactions: StorageManager.getInstance().loadTransactions(),
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);

      // Валидация формата данных
      if (!data.cards || !Array.isArray(data.cards)) {
        throw new Error("Неверный формат данных");
      }

      // Импорт с подтверждением
      const confirmed = confirm(
        `Импортировать ${data.cards.length} карточек и ${
          data.transactions?.length || 0
        } транзакций?\n` + `Это заменит все текущие данные.`
      );

      if (confirmed) {
        StorageManager.getInstance().saveCards(data.cards);
        StorageManager.getInstance().saveTransactions(data.transactions || []);

        // Синхронизация с облаком
        SyncManager.getInstance().syncToCloud();

        window.location.reload(); // Перезагрузка интерфейса
      }
    } catch (error) {
      alert("Ошибка импорта данных: " + error.message);
    }
  }

  downloadBackup(): void {
    const data = this.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);
  }
}
```

## Интеграция слоя API

### Архитектура сервисного слоя

### Data Service Architecture

```
// Service layer for data operations
class FinanceService {
  // Card operations
  async createCard(cardData: Omit<Card, "id">): Promise<Card> {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const cards = StorageManager.getInstance().loadCards();
    cards.push(newCard);
    StorageManager.getInstance().saveCards(cards);

    return newCard;
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    const cards = StorageManager.getInstance().loadCards();
    const index = cards.findIndex((card) => card.id === id);

    if (index === -1) throw new Error("Card not found");

    cards[index] = { ...cards[index], ...updates, updatedAt: new Date() };
    StorageManager.getInstance().saveCards(cards);

    return cards[index];
  }

  async deleteCard(id: string): Promise<void> {
    const cards = StorageManager.getInstance().loadCards();
    const filtered = cards.filter((card) => card.id !== id);
    StorageManager.getInstance().saveCards(filtered);

    // Also delete related transactions
    const transactions = StorageManager.getInstance().loadTransactions();
    const filteredTransactions = transactions.filter((t) => t.cardId !== id);
    StorageManager.getInstance().saveTransactions(filteredTransactions);
  }

  // Transaction operations
  async addTransaction(
    transactionData: Omit<Transaction, "id">
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    const transactions = StorageManager.getInstance().loadTransactions();
    transactions.push(newTransaction);
    StorageManager.getInstance().saveTransactions(transactions);

    // Update card balance
    await this.updateCardBalance(
      transactionData.cardId,
      transactionData.amount,
      transactionData.type
    );

    return newTransaction;
  }

  private async updateCardBalance(
    cardId: string,
    amount: number,
    type: "income" | "expense"
  ): Promise<void> {
    const cards = StorageManager.getInstance().loadCards();
    const card = cards.find((c) => c.id === cardId);

    if (!card) throw new Error("Card not found");

    const balanceChange = type === "income" ? amount : -amount;
    await this.updateCard(cardId, {
      balance: card.balance + balanceChange,
      lastTransaction: { amount, type, timestamp: new Date() },
    });
  }
}
```

### Authentication Service

```
class AuthService {
  private static readonly VALID_CREDENTIALS = {
    username: "user",
    password: "pass",
  };

  authenticate(username: string, password: string): boolean {
    return (
      username === AuthService.VALID_CREDENTIALS.username &&
      password === AuthService.VALID_CREDENTIALS.password
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("isAuthenticated") === "true";
  }

  login(username: string, password: string): boolean {
    if (this.authenticate(username, password)) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", username);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
  }
}
```

## User Interface Architecture

### Dashboard Layout

```
graph TB
    A[Header Navigation] --> B[Dashboard Container]
    B --> C[Summary Cards]
    B --> D[Action Bar]
    B --> E[Card Grid]
    E --> F[Card Item 1]
    E --> G[Card Item 2]
    E --> H[Card Item N]
    E --> I[Add Card Button]

    F --> J[Card Actions]
    J --> K[History Button]
    J --> L[Edit Balance Button]

    style A fill:#e3f2fd
    style B fill:#f1f8e9
    style E fill:#fff3e0
    style F fill:#fce4ec
```

### Modal System Architecture

```typescript
// Modal management system
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
}

interface ModalState {
  activeModal: string | null;
  modalProps: any;
}

// Modal types
enum ModalType {
  ADD_CARD = "add_card",
  EDIT_CARD = "edit_card",
  ADD_TRANSACTION = "add_transaction",
  CONFIRM_DELETE = "confirm_delete",
}
```

### Form Validation Architecture

```typescript
// Validation rules
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FormField {
  name: string;
  value: any;
  error: string | null;
  rules: ValidationRule[];
}

// Form validation system
class FormValidator {
  static validateField(field: FormField): string | null {
    const { value, rules } = field;

    for (const rule of rules) {
      if (rule.required && !value) {
        return "This field is required";
      }

      if (rule.minLength && value.length < rule.minLength) {
        return `Minimum length is ${rule.minLength}`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return "Invalid format";
      }

      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) return customError;
      }
    }

    return null;
  }
}
```

## Cross-Platform Responsive Design

### Mobile-First Implementation

```
/_ Base mobile styles _/
.container {
padding: 1rem;
max-width: 100%;
}

.card-item {
margin-bottom: 1rem;
border-radius: 12px;
padding: 1rem;
}

/_ Tablet styles _/
@media (min-width: 768px) {
.container {
padding: 2rem;
max-width: 1200px;
margin: 0 auto;
}

.card-grid {
grid-template-columns: repeat(2, 1fr);
gap: 1.5rem;
}

.modal-container {
max-width: 500px;
margin: 0 auto;
}
}

/_ Desktop styles _/
@media (min-width: 1024px) {
.card-grid {
grid-template-columns: repeat(3, 1fr);
gap: 2rem;
}

.sidebar {
display: block;
width: 250px;
}

.main-content {
margin-left: 250px;
}
}

```

### Touch-Friendly Interface

```
/* Touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  touch-action: manipulation;
}

/* Swipe gestures for mobile */
.card-item {
  position: relative;
  overflow: hidden;
}

.card-actions {
  position: absolute;
  right: -100px;
  top: 0;
  height: 100%;
  width: 100px;
  transition: right 0.3s ease;
}

.card-item.swiped .card-actions {
  right: 0;
}
```

## Testing Strategy

### Unit Testing Architecture

```
// Test utilities
export const createMockCard = (overrides?: Partial<Card>): Card => ({
  id: "test-card-1",
  name: "Test Card",
  backgroundColor: "#3b82f6",
  balance: 1000,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTransaction = (
  overrides?: Partial<Transaction>
): Transaction => ({
  id: "test-transaction-1",
  cardId: "test-card-1",
  amount: 100,
  type: "income",
  timestamp: new Date(),
  ...overrides,
});

// Component testing
describe("CardItem Component", () => {
  test("displays card information correctly", () => {
    const mockCard = createMockCard();
    render(<CardItem card={mockCard} />);

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockCard.balance}`)).toBeInTheDocument();
  });

  test("handles edit action correctly", () => {
    const mockCard = createMockCard();
    const onEdit = jest.fn();
    render(<CardItem card={mockCard} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockCard.id);
  });
});
```

### Integration Testing

```
// Service integration tests
describe("FinanceService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("creates and persists new card", async () => {
    const service = new FinanceService();
    const cardData = {
      name: "Test Card",
      backgroundColor: "#ff0000",
      balance: 500,
    };

    const newCard = await service.createCard(cardData);

    expect(newCard).toMatchObject(cardData);
    expect(newCard.id).toBeDefined();

    const storedCards = StorageManager.getInstance().loadCards();
    expect(storedCards).toContainEqual(newCard);
  });

  test("updates card balance when transaction is added", async () => {
    const service = new FinanceService();
    const card = await service.createCard({
      name: "Test Card",
      backgroundColor: "#ff0000",
      balance: 500,
    });

    await service.addTransaction({
      cardId: card.id,
      amount: 100,
      type: "income",
    });

    const updatedCards = StorageManager.getInstance().loadCards();
    const updatedCard = updatedCards.find((c) => c.id === card.id);
    expect(updatedCard?.balance).toBe(600);
  });
});
```

### End-to-End Testing

```typescript
// Cypress E2E tests
describe("Personal Finance App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("allows user to login and manage cards", () => {
    // Login
    cy.get('[data-testid="username-input"]').type("user");
    cy.get('[data-testid="password-input"]').type("pass");
    cy.get('[data-testid="login-button"]').click();

    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");

    // Add new card
    cy.get('[data-testid="add-card-button"]').click();
    cy.get('[data-testid="card-name-input"]').type("My Savings");
    cy.get('[data-testid="card-balance-input"]').type("1000");
    cy.get('[data-testid="color-picker"]').click();
    cy.get('[data-testid="color-blue"]').click();
    cy.get('[data-testid="save-card-button"]').click();

    // Verify card appears
    cy.get('[data-testid="card-item"]').should("contain", "My Savings");
    cy.get('[data-testid="card-item"]').should("contain", "$1,000");
  });

  it("handles transaction creation and balance updates", () => {
    // ... setup existing card

    // Add transaction
    cy.get('[data-testid="card-item"]')
      .first()
      .find('[data-testid="add-transaction"]')
      .click();
    cy.get('[data-testid="amount-input"]').type("150");
    cy.get('[data-testid="transaction-type-income"]').click();
    cy.get('[data-testid="save-transaction"]').click();

    // Verify balance update
    cy.get('[data-testid="card-balance"]').should("contain", "$1,150");
  });
});
```
