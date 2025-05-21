import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Expense, 
  Budget, 
  FilterOptions, 
  Category, 
  TimeFrame, 
  SortOptions, 
  ViewMode, 
  ThemeMode, 
  CATEGORIES 
} from '../types';
import { getDefaultExpenses, getDefaultBudgets } from '../utils/defaultData';
import { 
  isToday, 
  isThisWeek, 
  isThisMonth, 
  isThisYear, 
  isWithinInterval, 
  parseISO 
} from 'date-fns';

interface AppContextType {
  expenses: Expense[];
  budgets: Budget[];
  filterOptions: FilterOptions;
  sortOptions: SortOptions;
  viewMode: ViewMode;
  themeMode: ThemeMode;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: Budget) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  setSortOptions: (options: SortOptions) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleThemeMode: () => void;
  filteredExpenses: Expense[];
  totalExpenses: number;
  categoryTotals: Record<Category, number>;
  monthlyTotals: Record<string, number>;
  exportData: () => void;
}

const initialFilterOptions: FilterOptions = {
  category: 'Toutes',
  timeframe: 'Ce mois-ci',
  searchQuery: '',
  startDate: null,
  endDate: null,
};

const initialSortOptions: SortOptions = {
  field: 'date',
  direction: 'desc',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : getDefaultExpenses();
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : getDefaultBudgets();
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [sortOptions, setSortOptions] = useState<SortOptions>(initialSortOptions);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme ? (savedTheme as ThemeMode) : 'light';
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = { ...expenseData, id: uuidv4() };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const setBudget = (newBudget: Budget) => {
    const existingIndex = budgets.findIndex(b => b.category === newBudget.category);
    if (existingIndex !== -1) {
      setBudgets(budgets.map((budget, index) => 
        index === existingIndex ? newBudget : budget
      ));
    } else {
      setBudgets([...budgets, newBudget]);
    }
  };

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateFilterOptions = (options: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...options }));
  };

  // Filter expenses based on current filter options
  const filteredExpenses = expenses.filter(expense => {
    // Filter by category
    if (filterOptions.category !== 'Toutes' && expense.category !== filterOptions.category) {
      return false;
    }

    // Filter by planned/actual
    if (viewMode === 'planned' && !expense.isPlanned) {
      return false;
    } else if (viewMode === 'expenses' && expense.isPlanned) {
      return false;
    }

    // Filter by search query
    if (filterOptions.searchQuery && !expense.title.toLowerCase().includes(filterOptions.searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by timeframe
    const expenseDate = parseISO(expense.date);
    
    switch (filterOptions.timeframe) {
      case 'Aujourd\'hui':
        return isToday(expenseDate);
      case 'Cette semaine':
        return isThisWeek(expenseDate);
      case 'Ce mois-ci':
        return isThisMonth(expenseDate);
      case 'Cette année':
        return isThisYear(expenseDate);
      case 'Personnalisé':
        if (filterOptions.startDate && filterOptions.endDate) {
          return isWithinInterval(expenseDate, {
            start: parseISO(filterOptions.startDate),
            end: parseISO(filterOptions.endDate)
          });
        }
        return true;
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort by selected field and direction
    const { field, direction } = sortOptions;
    
    if (field === 'amount') {
      return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (field === 'date') {
      return direction === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    // For title and category (string fields)
    const aValue = a[field].toLowerCase();
    const bValue = b[field].toLowerCase();
    return direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate totals by category
  const categoryTotals = CATEGORIES.reduce((totals, category) => {
    const sum = filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { ...totals, [category]: sum };
  }, {} as Record<Category, number>);

  // Calculate monthly totals for the chart
  const monthlyTotals = expenses.reduce((totals: Record<string, number>, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    totals[monthYear] = (totals[monthYear] || 0) + expense.amount;
    return totals;
  }, {});

  // Export data to CSV
  const exportData = () => {
    const headers = ['Titre', 'Montant', 'Catégorie', 'Date', 'Planifié'];
    const csvData = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        `"${expense.title}"`, 
        expense.amount,
        `"${expense.category}"`,
        new Date(expense.date).toLocaleDateString('fr-FR'),
        expense.isPlanned ? 'Oui' : 'Non'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mes-depenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value: AppContextType = {
    expenses,
    budgets,
    filterOptions,
    sortOptions,
    viewMode,
    themeMode,
    addExpense,
    updateExpense,
    deleteExpense,
    setBudget,
    setFilterOptions: updateFilterOptions,
    setSortOptions,
    setViewMode,
    toggleThemeMode,
    filteredExpenses,
    totalExpenses,
    categoryTotals,
    monthlyTotals,
    exportData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};