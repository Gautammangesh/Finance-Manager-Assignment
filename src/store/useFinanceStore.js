import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food', icon: 'utensils', color: '#F87171' },
  { id: '2', name: 'Transport', icon: 'car', color: '#60A5FA' },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#F472B6' },
  { id: '4', name: 'Entertainment', icon: 'film', color: '#A78BFA' },
  { id: '5', name: 'Salary', icon: 'briefcase', color: '#34D399' },
  { id: '6', name: 'Investment', icon: 'trending-up', color: '#10B981' },
];

export const useFinanceStore = create(
  persist(
    (set) => ({
      user: {
        name: 'Alex Yu',
        email: 'alex@payu.com',
        balance: 20000,
      },
      transactions: [],
      categories: DEFAULT_CATEGORIES,

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: Math.random().toString(36).substring(7) },
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
          const transactionToDelete = state.transactions.find((t) => t.id === id);
          if (!transactionToDelete) return state;
          
          return {
            transactions: state.transactions.filter((t) => t.id !== id),
            user: {
              ...state.user,
              balance:
                transactionToDelete.type === 'income'
                  ? state.user.balance - transactionToDelete.amount
                  : state.user.balance + transactionToDelete.amount,
            },
          };
        }),

      updateProfile: (profile) =>
        set((state) => ({
          user: { ...state.user, ...profile },
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: Math.random().toString(36).substring(7) },
          ],
        })),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
