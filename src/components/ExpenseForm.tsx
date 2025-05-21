import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Expense, CATEGORIES } from '../types';
import { useAppContext } from '../context/AppContext';

interface ExpenseFormProps {
  editExpense?: Expense;
  onCancel?: () => void;
  isModal?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  editExpense, 
  onCancel,
  isModal = false
}) => {
  const { addExpense, updateExpense } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date());
  const [isPlanned, setIsPlanned] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editExpense) {
      setTitle(editExpense.title);
      setAmount(editExpense.amount.toString());
      setCategory(editExpense.category);
      setDate(new Date(editExpense.date));
      setIsPlanned(editExpense.isPlanned);
    }
  }, [editExpense]);

  // Validate form input
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Montant invalide';
    }
    
    if (!date) {
      newErrors.date = 'La date est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: date.toISOString().split('T')[0],
      isPlanned,
    };
    
    if (editExpense) {
      updateExpense({ ...expenseData, id: editExpense.id });
    } else {
      addExpense(expenseData);
      
      // Clear form for new entries
      setTitle('');
      setAmount('');
      setCategory(CATEGORIES[0]);
      setDate(new Date());
      setIsPlanned(false);
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Close modal if in modal mode
    if (isModal && onCancel) {
      onCancel();
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${isModal ? 'p-6' : 'p-4'}`}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {editExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
        </h2>
        {isModal && onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            placeholder="Ex: Courses au supermarché"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>
        
        {/* Amount field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Montant (€)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.amount ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            placeholder="Ex: 42.50"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
          )}
        </div>
        
        {/* Category dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {/* Date picker */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.date ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>
        
        {/* Is planned checkbox */}
        <div className="flex items-center">
          <input
            id="isPlanned"
            type="checkbox"
            checked={isPlanned}
            onChange={(e) => setIsPlanned(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPlanned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Dépense planifiée
          </label>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          {isModal && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editExpense ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Mettre à jour
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Success message */}
      {showSuccessMessage && (
        <motion.div
          className="mt-4 p-2 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md text-sm text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {editExpense ? 'Dépense mise à jour avec succès !' : 'Dépense ajoutée avec succès !'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpenseForm;