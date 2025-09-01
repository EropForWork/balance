import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModalState, Notification, LoadingState } from "../types";

interface UIState {
  modals: ModalState;
  notifications: Notification[];
  loading: LoadingState;
  sidebarOpen: boolean;
}

interface UIActions {
  // Управление модальными окнами
  openModal: (modalName: keyof ModalState, data?: any) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;

  // Управление уведомлениями
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Управление состоянием загрузки
  setLoading: (type: keyof LoadingState, state: boolean) => void;

  // Управление сайдбаром
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

const initialModalState: ModalState = {
  addCard: false,
  editCard: { isOpen: false },
  quickTransaction: { isOpen: false },
  deleteConfirmation: { isOpen: false },
};

const initialLoadingState: LoadingState = {
  global: false,
  cardActions: false,
  sync: false,
  transactions: false,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Состояние
      modals: initialModalState,
      notifications: [],
      loading: initialLoadingState,
      sidebarOpen: false,

      // Управление модальными окнами
      openModal: (modalName: keyof ModalState, data?: any) => {
        set((state) => {
          const newModals = { ...state.modals };

          if (modalName === "addCard") {
            newModals.addCard = true;
          } else if (modalName === "editCard") {
            newModals.editCard = { isOpen: true, cardId: data?.cardId };
          } else if (modalName === "quickTransaction") {
            newModals.quickTransaction = { isOpen: true, cardId: data?.cardId };
          } else if (modalName === "deleteConfirmation") {
            newModals.deleteConfirmation = {
              isOpen: true,
              cardId: data?.cardId,
              type: data?.type || "card",
              itemId: data?.itemId,
            };
          }

          return { modals: newModals };
        });
      },

      closeModal: (modalName: keyof ModalState) => {
        set((state) => {
          const newModals = { ...state.modals };

          if (modalName === "addCard") {
            newModals.addCard = false;
          } else if (modalName === "editCard") {
            newModals.editCard = { isOpen: false };
          } else if (modalName === "quickTransaction") {
            newModals.quickTransaction = { isOpen: false };
          } else if (modalName === "deleteConfirmation") {
            newModals.deleteConfirmation = { isOpen: false };
          }

          return { modals: newModals };
        });
      },

      closeAllModals: () => {
        set({ modals: initialModalState });
      },

      // Управление уведомлениями
      addNotification: (notification: Omit<Notification, "id">) => {
        const id = crypto.randomUUID();
        const newNotification: Notification = {
          ...notification,
          id,
          autoClose: notification.autoClose ?? true,
          duration: notification.duration ?? 5000,
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Автоматическое удаление уведомления
        if (newNotification.autoClose) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Управление состоянием загрузки
      setLoading: (type: keyof LoadingState, state: boolean) => {
        set((currentState) => ({
          loading: {
            ...currentState.loading,
            [type]: state,
          },
        }));
      },

      // Управление сайдбаром
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebar: (open: boolean) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: "balance-ui-storage",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Хелперы для упрощения работы с уведомлениями
export const showSuccessNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: "success",
    title,
    message,
  });
};

export const showErrorNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: "error",
    title,
    message,
    autoClose: false, // Ошибки не закрываются автоматически
  });
};

export const showWarningNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: "warning",
    title,
    message,
  });
};

export const showInfoNotification = (title: string, message: string) => {
  useUIStore.getState().addNotification({
    type: "info",
    title,
    message,
  });
};
