import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { Category, CATEGORIES } from '../types';
import BudgetProgress from './BudgetProgress';

const Dashboard: React.FC = () => {
  const { 
    filteredExpenses, 
    totalExpenses, 
    categoryTotals, 
    monthlyTotals 
  } = useAppContext();

  // Prepare data for pie chart
  const pieData = CATEGORIES.map(category => ({
    name: category,
    value: categoryTotals[category] || 0,
  })).filter(item => item.value > 0);

  // Prepare data for monthly chart
  const monthlyData = Object.entries(monthlyTotals)
    .map(([month, amount]) => ({
      month,
      amount
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/').map(Number);
      const [bMonth, bYear] = b.month.split('/').map(Number);
      
      // Compare years first
      if (aYear !== bYear) {
        return aYear - bYear;
      }
      
      // If years are the same, compare months
      return aMonth - bMonth;
    })
    .slice(-6); // Get only the last 6 months

  // Calculate top spending categories
  const topCategories = [...CATEGORIES]
    .map(category => ({
      category,
      amount: categoryTotals[category] || 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600 dark:text-blue-400">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {payload[0].payload.percentage}% du total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des dépenses</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            {totalExpenses > 0 ? (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {filteredExpenses.length} transaction(s)
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Aucune dépense sur la période
              </span>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dépense moyenne</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(filteredExpenses.length ? totalExpenses / filteredExpenses.length : 0)}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            Par transaction
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top catégorie</h3>
          {topCategories.length > 0 ? (
            <>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {topCategories[0].category}
              </p>
              <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                {formatCurrency(topCategories[0].amount)}
              </div>
            </>
          ) : (
            <p className="mt-2 text-gray-500 dark:text-gray-400">Aucune donnée</p>
          )}
        </motion.div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Répartition par Catégorie</h3>
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.map(item => ({
                      ...item,
                      percentage: Math.round((item.value / totalExpenses) * 100)
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée à afficher</p>
            </div>
          )}
        </motion.div>

        {/* Monthly trend chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Évolution Mensuelle</h3>
          {monthlyData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tickFormatter={(month) => {
                      const [m, y] = month.split('/');
                      return `${m}/${y.slice(2)}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Montant"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée à afficher</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top spending categories */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Catégories de Dépenses</h3>
        {topCategories.length > 0 ? (
          <div className="space-y-4">
            {topCategories.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div style={{ width: '40%' }}>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</p>
                </div>
                <div style={{ width: '40%' }}>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (item.amount / (topCategories[0].amount || 1)) * 100)}%`,
                        backgroundColor: getCategoryColor(item.category)
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: '20%' }} className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune dépense à afficher</p>
        )}
      </motion.div>

      {/* Budget progress */}
      <motion.div 
        variants={itemVariants}
      >
        <BudgetProgress viewOnly={true} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;