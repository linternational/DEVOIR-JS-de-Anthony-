export type Category = 
  | 'Alimentation'
  | 'Transport'
  | 'Logement'
  | 'Divertissement'
  | 'Éducation'
  | 'Épargne'
  | 'Investissements'
  | 'Santé'
  | 'Charges Fixes'
  | 'Divers';

export const CATEGORIES: Category[] = [
  'Alimentation',
  'Transport',
  'Logement',
  'Divertissement',
  'Éducation',
  'Épargne',
  'Investissements',
  'Santé',
  'Charges Fixes',
  'Divers'
];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO string format
  isPlanned: boolean;
};

export type Budget = {
  category: Category;
  amount: number;
};

export type FilterOptions = {
  category: Category | 'Toutes';
  timeframe: TimeFrame;
  searchQuery: string;
  startDate: string | null;
  endDate: string | null;
};

export type TimeFrame = 
  | 'Tous'
  | 'Aujourd\'hui'
  | 'Cette semaine'
  | 'Ce mois-ci'
  | 'Cette année'
  | 'Personnalisé';

export type SortOptions = {
  field: 'title' | 'amount' | 'category' | 'date';
  direction: 'asc' | 'desc';
};

export type ViewMode = 'dashboard' | 'expenses' | 'planned' | 'budgets';

export type ThemeMode = 'light' | 'dark';