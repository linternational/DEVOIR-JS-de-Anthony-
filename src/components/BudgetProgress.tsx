import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, Plus, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, getCategoryColor, calculatePercentage } from '../utils/formatters';
import { Budget, Category, CATEGORIES } from '../types';

interface BudgetProgressProps {
  viewOnly?: boolean;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ viewOnly = false }) => {
  const { budgets, setBudget, categoryTotals } = useAppContext();
  const [editMode, setEditMode] = useState<Record<Category, boolean>>({} as Record<Category, boolean>);
  const [newBudgets, setNewBudgets] = useState<Record<Category, string>>({} as Record<Category, string>);

  // Initialize edit state for new category
  const handleEditClick = (category: Category) => {
    const currentBudget = budgets.find(b => b.category === category);
    
    setEditMode(prev => ({
      ...prev,
      [category]: true
    }));
    
    setNewBudgets(prev => ({
      ...prev,
      [category]: currentBudget ? currentBudget.amount.toString() : '0'
    }));
  };

  // Save budget
  const handleSaveClick = (category: Category) => {
    const amount = parseFloat(newBudgets[category]);
    
    if (!isNaN(amount) && amount >= 0) {
      setBudget({
        category,
        amount
      });
      
      setEditMode(prev => ({
        ...prev,
        [category]: false
      }));
    }
  };

  // Handle input change
  const handleInputChange = (category: Category, value: string) => {
    setNewBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Suivi des Budgets</h3>
        
        {!viewOnly && (
          <button
            onClick={() => {
              // Find categories without budgets
              const unbudgetedCategories = CATEGORIES.filter(
                category => !budgets.some(b => b.category === category)
              );
              
              if (unbudgetedCategories.length > 0) {
                handleEditClick(unbudgetedCategories[0]);
              }
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter budget
          </button>
        )}
      </div>
      
      <motion.div className="space-y-6" variants={containerVariants}>
        {CATEGORIES.map(category => {
          const budget = budgets.find(b => b.category === category);
          const spent = categoryTotals[category] || 0;
          
          // Skip if no budget and not in edit mode
          if (!budget && !editMode[category]) return null;
          
          const budgetAmount = budget ? budget.amount : 0;
          const percentage = calculatePercentage(spent, budgetAmount);
          const isOverBudget = spent > budgetAmount && budgetAmount > 0;
          
          return (
            <motion.div key={category} className="space-y-2" variants={itemVariants}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</h4>
                  {editMode[category] ? (
                    <div className="mt-1 flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-2">Budget:</span>
                      <input
                        type="number"
                        value={newBudgets[category]}
                        onChange={(e) => handleInputChange(category, e.target.value)}
                        className="block w-24 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="1"
                      />
                      <button
                        onClick={() => handleSaveClick(category)}
                        className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Enregistrer
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center space-x-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(spent)} / {formatCurrency(budgetAmount)}
                      </p>
                      
                      {!viewOnly && (
                        <button
                          onClick={() => handleEditClick(category)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {!editMode[category] && (
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {isOverBudget ? (
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Dépassé de {formatCurrency(spent - budgetAmount)}
                        </span>
                      ) : (
                        budgetAmount > 0 && `${percentage}%`
                      )}
                    </p>
                  </div>
                )}
              </div>
              
              {!editMode[category] && budgetAmount > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : ''}`}
                    style={{ 
                      width: `${Math.min(100, percentage)}%`,
                      backgroundColor: isOverBudget ? undefined : getCategoryColor(category)
                    }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
        
        {budgets.length === 0 && !Object.keys(editMode).length && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              {viewOnly 
                ? "Aucun budget défini pour le moment" 
                : "Définissez des budgets pour commencer à suivre vos dépenses"}
            </p>
            {!viewOnly && (
              <button
                onClick={() => handleEditClick(CATEGORIES[0])}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un premier budget
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BudgetProgress;