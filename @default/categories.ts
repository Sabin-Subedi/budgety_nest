import { TransactionType } from '@prisma/client';

export const defaultCategories = Object.freeze([
  {
    name: '🚘 Transportation',
    description: 'Bus,Subway,Taxi,Car',
    type: TransactionType.EXPENSE,
  },
  {
    name: '🍕 Food',
    description: 'Lunch,Dinner,Snack',
    type: TransactionType.EXPENSE,
  },
  {
    name: '🏠 Housing',
    description: 'Rent,Mortgage,Property Tax',
    type: TransactionType.EXPENSE,
  },
  {
    name: '📚 Education',
    description: 'Tuition,Books,Supplies',
    type: TransactionType.EXPENSE,
  },
]);
