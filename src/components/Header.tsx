import React from 'react';
import { Sun, Moon, BarChart, ListChecks, Calendar, Wallet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

const Header: React.FC = () => {
  const { viewMode, setViewMode, themeMode, toggleThemeMode } = useAppContext();

  const logoSpring = useSpring({
    from: { transform: 'scale(0.9)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.1)' });
        await next({ transform: 'scale(0.9)' });
      }
    },
    config: { tension: 300, friction: 10 },
    loop: true,
  });

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent dark:from-blue-400/10" />
      
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <motion.div 
            className="flex items-center mb-4 sm:mb-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <animated.div style={logoSpring}>
              <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </animated.div>
            <h1 className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
              Mon Voyage Vers la Liberté Financière
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleThemeMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-glow"
              aria-label={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {themeMode === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.button>
            
            <nav className="ml-4 flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 shadow-inner-lg">
              {[
                { mode: 'dashboard', icon: BarChart, label: 'Tableau de bord' },
                { mode: 'expenses', icon: ListChecks, label: 'Dépenses' },
                { mode: 'planned', icon: Calendar, label: 'Planifiées' },
                { mode: 'budgets', icon: Wallet, label: 'Budgets' },
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md hover:shadow-glow'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-75" />
    </header>
  );
};

export default Header;