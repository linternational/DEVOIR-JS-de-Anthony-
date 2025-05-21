import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, ChevronUp, ChevronDown, Filter, Download, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Expense, SortOptions, FilterOptions, CATEGORIES, TimeFrame } from '../types';
import ExpenseForm from './ExpenseForm';
import DatePicker from 'react-datepicker';

const ExpenseTable: React.FC = () => {
  const { 
    filteredExpenses, 
    totalExpenses, 
    deleteExpense, 
    sortOptions, 
    setSortOptions,
    filterOptions,
    setFilterOptions,
    exportData,
    viewMode
  } = useAppContext();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    filterOptions.startDate ? new Date(filterOptions.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filterOptions.endDate ? new Date(filterOptions.endDate) : null
  );

  // Handle sort click
  const handleSortClick = (field: SortOptions['field']) => {
    if (sortOptions.field === field) {
      // Toggle direction if same field
      setSortOptions({
        ...sortOptions,
        direction: sortOptions.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New field, default to ascending
      setSortOptions({
        field,
        direction: 'asc'
      });
    }
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    deleteExpense(id);
    setShowDeleteConfirm(null);
  };

  // Handle edit click
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingExpense(null);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    if (key === 'timeframe' && value === 'Personnalisé') {
      setFilterOptions({ ...filterOptions, [key]: value });
    } else if (key === 'timeframe') {
      // Reset custom date range when selecting a predefined timeframe
      setFilterOptions({
        ...filterOptions,
        [key]: value,
        startDate: null,
        endDate: null
      });
      setStartDate(null);
      setEndDate(null);
    } else {
      setFilterOptions({ ...filterOptions, [key]: value });
    }
  };

  // Apply custom date range
  const applyDateRange = () => {
    setFilterOptions({
      ...filterOptions,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      category: 'Toutes',
      timeframe: 'Tous',
      searchQuery: '',
      startDate: null,
      endDate: null
    });
    setStartDate(null);
    setEndDate(null);
  };

  const timeframes: TimeFrame[] = [
    'Tous',
    'Aujourd\'hui',
    'Cette semaine',
    'Ce mois-ci',
    'Cette année',
    'Personnalisé'
  ];

  // Table row animation
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    }),
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {viewMode === 'planned' ? 'Dépenses Planifiées' : 'Liste des Dépenses'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {filteredExpenses.length} dépense(s) • Total: {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </button>
          <button
            onClick={exportData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie
                </label>
                <select
                  id="category-filter"
                  value={filterOptions.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="Toutes">Toutes les catégories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Timeframe filter */}
              <div>
                <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Période
                </label>
                <select
                  id="timeframe-filter"
                  value={filterOptions.timeframe}
                  onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe} value={timeframe}>{timeframe}</option>
                  ))}
                </select>
              </div>
              
              {/* Search filter */}
              <div>
                <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rechercher
                </label>
                <input
                  type="text"
                  id="search-filter"
                  value={filterOptions.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder="Titre de la dépense..."
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              {/* Reset button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
            
            {/* Custom date range */}
            {filterOptions.timeframe === 'Personnalisé' && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de début
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de fin
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={applyDateRange}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('title')}
              >
                <div className="flex items-center">
                  Titre
                  {sortOptions.field === 'title' && (
                    sortOptions.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('amount')}
              >
                <div className="flex items-center">
                  Montant
                  {sortOptions.field === 'amount' && (
                    sortOptions.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('category')}
              >
                <div className="flex items-center">
                  Catégorie
                  {sortOptions.field === 'category' && (
                    sortOptions.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick('date')}
              >
                <div className="flex items-center">
                  Date
                  {sortOptions.field === 'date' && (
                    sortOptions.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <motion.tr 
                    key={expense.id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={expense.isPlanned ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      {/* Delete confirmation modal */}
                      {showDeleteConfirm === expense.id && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                          <motion.div 
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
                              <AlertCircle className="h-6 w-6 mr-2" />
                              <h3 className="text-lg font-medium">Confirmer la suppression</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => confirmDelete(expense.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                              >
                                Supprimer
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="font-medium mb-2">Aucune dépense trouvée</p>
                      <p className="text-xs">
                        {filterOptions.category !== 'Toutes' || filterOptions.searchQuery || filterOptions.timeframe !== 'Tous' ? 
                          "Essayez de modifier vos filtres pour voir plus de résultats" : 
                          "Ajoutez votre première dépense en utilisant le formulaire"}
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Total row */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-end">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total: <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Edit expense modal */}
      {editingExpense && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="max-w-lg w-full">
            <ExpenseForm 
              editExpense={editingExpense} 
              onCancel={closeEditModal}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;