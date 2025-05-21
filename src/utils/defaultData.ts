import { Expense, Budget, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate dates for the sample data
const today = new Date();
const thisMonth = today.getMonth();
const thisYear = today.getFullYear();

// Helper to create a date string in the past
const createPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Helper to create a date string in the future
const createFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Sample expenses data
export const getDefaultExpenses = (): Expense[] => [
  {
    id: uuidv4(),
    title: 'Courses supermarché',
    amount: 85.50,
    category: 'Alimentation',
    date: createPastDate(2),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Abonnement Netflix',
    amount: 13.99,
    category: 'Divertissement',
    date: createPastDate(15),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Essence',
    amount: 60.00,
    category: 'Transport',
    date: createPastDate(5),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Loyer',
    amount: 750.00,
    category: 'Logement',
    date: createPastDate(20),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Restaurant avec amis',
    amount: 42.50,
    category: 'Alimentation',
    date: createPastDate(8),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Livres universitaires',
    amount: 120.00,
    category: 'Éducation',
    date: createPastDate(25),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Abonnement salle de sport',
    amount: 35.00,
    category: 'Santé',
    date: createPastDate(10),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Facture électricité',
    amount: 65.75,
    category: 'Charges Fixes',
    date: createPastDate(18),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Investissement actions',
    amount: 200.00,
    category: 'Investissements',
    date: createPastDate(30),
    isPlanned: false
  },
  {
    id: uuidv4(),
    title: 'Épargne mensuelle',
    amount: 150.00,
    category: 'Épargne',
    date: createPastDate(1),
    isPlanned: false
  },
  // Planned expenses
  {
    id: uuidv4(),
    title: 'Impôts locaux',
    amount: 350.00,
    category: 'Charges Fixes',
    date: createFutureDate(15),
    isPlanned: true
  },
  {
    id: uuidv4(),
    title: 'Entretien voiture',
    amount: 120.00,
    category: 'Transport',
    date: createFutureDate(10),
    isPlanned: true
  },
  {
    id: uuidv4(),
    title: 'Anniversaire maman',
    amount: 50.00,
    category: 'Divers',
    date: createFutureDate(20),
    isPlanned: true
  }
];

// Sample budgets data
export const getDefaultBudgets = (): Budget[] => [
  { category: 'Alimentation', amount: 400 },
  { category: 'Transport', amount: 150 },
  { category: 'Logement', amount: 800 },
  { category: 'Divertissement', amount: 100 },
  { category: 'Éducation', amount: 150 },
  { category: 'Épargne', amount: 200 },
  { category: 'Investissements', amount: 250 },
  { category: 'Santé', amount: 80 },
  { category: 'Charges Fixes', amount: 300 },
  { category: 'Divers', amount: 100 }
];