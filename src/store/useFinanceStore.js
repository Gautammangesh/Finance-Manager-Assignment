import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const createIsoDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food', icon: 'utensils', color: '#F4A261' },
  { id: '2', name: 'Travel', icon: 'car', color: '#57D2C4' },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#F28482' },
  { id: '4', name: 'Entertainment', icon: 'film', color: '#8B7CFF' },
  { id: '5', name: 'Salary', icon: 'briefcase', color: '#6AE4A6' },
  { id: '6', name: 'Investment', icon: 'trending-up', color: '#A5B4FC' },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'seed-1',
    type: 'income',
    amount: 25000,
    category: '5',
    date: createIsoDate(4),
    note: 'Monthly salary credited',
  },
  {
    id: 'seed-2',
    type: 'expense',
    amount: 1000,
    category: '1',
    date: createIsoDate(2),
    note: 'Dinner with friends',
  },
  {
    id: 'seed-3',
    type: 'expense',
    amount: 4000,
    category: '2',
    date: createIsoDate(1),
    note: 'Weekend travel booking',
  },
];

const DEFAULT_ACCOUNT = {
  name: 'Alex Yu',
  email: 'alex@tuf.com',
  password: 'tuf12345',
};

const DEFAULT_USER = {
  name: DEFAULT_ACCOUNT.name,
  email: DEFAULT_ACCOUNT.email,
  balance: 20000,
};

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      hasHydrated: false,
      isAuthenticated: false,
      themeMode: 'system',
      pendingUndoTransaction: null,
      authAccount: DEFAULT_ACCOUNT,
      user: DEFAULT_USER,
      transactions: INITIAL_TRANSACTIONS,
      categories: DEFAULT_CATEGORIES,
      setHasHydrated: (hasHydrated) =>
        set(() => ({
          hasHydrated,
        })),
      signIn: ({ email, password }) => {
        const account = get().authAccount;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || !normalizedPassword) {
          return { success: false, message: 'Email and password are required' };
        }

        if (normalizedEmail !== account.email.toLowerCase() || normalizedPassword !== account.password) {
          return { success: false, message: 'Incorrect email or password' };
        }

        set((state) => ({
          isAuthenticated: true,
          user: {
            ...state.user,
            name: account.name,
            email: account.email,
          },
        }));

        return { success: true };
      },
      signUp: ({ name, email, password }) => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
          return { success: false, message: 'All fields are required' };
        }

        set((state) => ({
          authAccount: {
            name: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
          },
          isAuthenticated: true,
          user: {
            ...state.user,
            name: trimmedName,
            email: trimmedEmail,
          },
        }));

        return { success: true };
      },
      signOut: () =>
        set(() => ({
          isAuthenticated: false,
        })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: Math.random().toString(36).substring(2, 10) },
            ...state.transactions,
          ],
          user: {
            ...state.user,
            balance:
              transaction.type === 'income'
                ? state.user.balance + transaction.amount
                : state.user.balance - transaction.amount,
          },
        })),
      deleteTransaction: (id) =>
        set((state) => {
          const transactionToDelete = state.transactions.find((transaction) => transaction.id === id);
          if (!transactionToDelete) {
            return state;
          }

          return {
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
            pendingUndoTransaction: transactionToDelete,
            user: {
              ...state.user,
              balance:
                transactionToDelete.type === 'income'
                  ? state.user.balance - transactionToDelete.amount
                  : state.user.balance + transactionToDelete.amount,
            },
          };
        }),
      restoreLastDeletedTransaction: () =>
        set((state) => {
          if (!state.pendingUndoTransaction) {
            return state;
          }

          const transactionToRestore = state.pendingUndoTransaction;

          return {
            transactions: [transactionToRestore, ...state.transactions],
            pendingUndoTransaction: null,
            user: {
              ...state.user,
              balance:
                transactionToRestore.type === 'income'
                  ? state.user.balance + transactionToRestore.amount
                  : state.user.balance - transactionToRestore.amount,
            },
          };
        }),
      clearPendingUndoTransaction: () =>
        set(() => ({
          pendingUndoTransaction: null,
        })),
      updateProfile: (profile) =>
        set((state) => ({
          user: { ...state.user, ...profile },
          authAccount: {
            ...state.authAccount,
            ...(profile.name ? { name: profile.name } : null),
            ...(profile.email ? { email: profile.email.trim().toLowerCase() } : null),
          },
        })),
      setThemeMode: (themeMode) =>
        set(() => ({
          themeMode,
        })),
      addCategory: (category) => {
        const id = Math.random().toString(36).substring(2, 10);
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id },
          ],
        }));
        return id;
      },
      resetDemoData: () =>
        set(() => ({
          isAuthenticated: false,
          authAccount: DEFAULT_ACCOUNT,
          user: DEFAULT_USER,
          themeMode: 'system',
          pendingUndoTransaction: null,
          transactions: INITIAL_TRANSACTIONS,
          categories: DEFAULT_CATEGORIES,
        })),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
