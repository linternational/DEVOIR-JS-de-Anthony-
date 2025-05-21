import React from 'react';
import { motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import BudgetProgress from './components/BudgetProgress';
import { useAppContext } from './context/AppContext';

// Main content wrapper component
const MainContent: React.FC = () => {
  const { viewMode } = useAppContext();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Form or Budget Management */}
        <div className="lg:col-span-1">
          {viewMode === 'budgets' ? (
            <BudgetProgress />
          ) : (
            <ExpenseForm />
          )}
        </div>
        
        {/* Right column - Dashboard or Tables */}
        <div className="lg:col-span-2">
          {viewMode === 'dashboard' ? (
            <Dashboard />
          ) : (
            <ExpenseTable />
          )}
        </div>
      </div>
    </main>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <MainContent />
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-10">
          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <motion.p 
              className="text-center text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Mon Voyage Vers la Liberté Financière (CABREL DIFFO B2 IT) © {new Date().getFullYear()}
            </motion.p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;