import { useFinanceStore } from './useFinanceStore';

const baseState = {
  user: {
    name: 'Alex Yu',
    email: 'alex@payu.com',
    balance: 20000,
  },
  transactions: [
    {
      id: 'seed-1',
      type: 'income',
      amount: 25000,
      category: '5',
      date: new Date('2026-04-03T00:00:00.000Z').toISOString(),
      note: 'Monthly salary credited',
    },
    {
      id: 'seed-2',
      type: 'expense',
      amount: 1000,
      category: '1',
      date: new Date('2026-04-05T00:00:00.000Z').toISOString(),
      note: 'Dinner with friends',
    },
  ],
  categories: [
    { id: '1', name: 'Food', icon: 'utensils', color: '#F4A261' },
    { id: '5', name: 'Salary', icon: 'briefcase', color: '#6AE4A6' },
  ],
};

beforeEach(() => {
  useFinanceStore.setState(baseState);
});

it('adds an expense transaction and updates balance', () => {
  useFinanceStore.getState().addTransaction({
    type: 'expense',
    amount: 500,
    category: '1',
    date: new Date('2026-04-07T00:00:00.000Z').toISOString(),
    note: 'Coffee',
  });

  const state = useFinanceStore.getState();

  expect(state.transactions[0].note).toBe('Coffee');
  expect(state.user.balance).toBe(19500);
});

it('deletes a transaction and restores balance', () => {
  useFinanceStore.getState().deleteTransaction('seed-2');

  const state = useFinanceStore.getState();

  expect(state.transactions).toHaveLength(1);
  expect(state.user.balance).toBe(21000);
});

it('updates the user profile', () => {
  useFinanceStore.getState().updateProfile({
    name: 'Alex Carter',
    email: 'alex.carter@payu.com',
  });

  const state = useFinanceStore.getState();

  expect(state.user.name).toBe('Alex Carter');
  expect(state.user.email).toBe('alex.carter@payu.com');
});

it('updates the theme mode', () => {
  useFinanceStore.getState().setThemeMode('dark');

  expect(useFinanceStore.getState().themeMode).toBe('dark');
});

it('adds a custom category and returns its id', () => {
  const newId = useFinanceStore.getState().addCategory({
    name: 'Bills',
    icon: 'shopping-bag',
    color: '#57D2C4',
  });

  const state = useFinanceStore.getState();

  expect(typeof newId).toBe('string');
  expect(state.categories.some((category) => category.id === newId && category.name === 'Bills')).toBe(true);
});
