'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

interface PricingOptimizerProps {
  currentPrice?: number;
  dealSize?: number;
  industry?: string;
  clientSize?: string;
  onPriceUpdate?: (newPrice: number) => void;
}

export default function PricingOptimizer({
  currentPrice = 50000,
  dealSize = 50000,
  industry = 'Technology',
  clientSize = 'Medium',
  onPriceUpdate,
}: PricingOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  // Mock optimization logic - would use AI in production
  const runOptimization = () => {
    setIsOptimizing(true);

    setTimeout(() => {
      // Simulate AI optimization
      const industryMultipliers: Record<string, number> = {
        Technology: 1.15,
        Finance: 1.25,
        Healthcare: 1.20,
        Retail: 0.95,
        Manufacturing: 1.05,
      };

      const clientSizeMultipliers: Record<string, number> = {
        Small: 0.85,
        Medium: 1.0,
        Large: 1.15,
        Enterprise: 1.30,
      };

      const industryMultiplier = industryMultipliers[industry] || 1.0;
      const sizeMultiplier = clientSizeMultipliers[clientSize] || 1.0;

      const baseOptimizedPrice = dealSize * industryMultiplier * sizeMultiplier;
      const suggestedPrice = Math.round(baseOptimizedPrice / 1000) * 1000;

      const winProbability = Math.min(
        95,
        Math.max(25, 75 - ((suggestedPrice - currentPrice) / currentPrice) * 100)
      );

      const results = {
        suggestedPrice,
        currentPrice,
        difference: suggestedPrice - currentPrice,
        percentChange: ((suggestedPrice - currentPrice) / currentPrice) * 100,
        winProbability,
        confidence: 87,
        insights: [
          {
            type: 'success',
            icon: CheckCircleIcon,
            message: `${industry} industry typically commands ${(industryMultiplier - 1) * 100}% premium pricing`,
          },
          {
            type: 'info',
            icon: LightbulbIcon,
            message: `${clientSize} companies have ${sizeMultiplier * 100}% average budget capacity`,
          },
          {
            type: suggestedPrice > currentPrice ? 'warning' : 'success',
            icon: suggestedPrice > currentPrice ? WarningIcon : TrendingUpIcon,
            message:
              suggestedPrice > currentPrice
                ? `Suggested price is ${Math.abs(((suggestedPrice - currentPrice) / currentPrice) * 100).toFixed(1)}% higher. Consider phased pricing or additional value items.`
                : `Great positioning! Your price is competitive for this market segment.`,
          },
          {
            type: 'info',
            icon: AutoGraphIcon,
            message: `Historical data shows ${winProbability.toFixed(0)}% win probability at suggested price point`,
          },
        ],
        marketComparison: {
          low: Math.round(suggestedPrice * 0.8),
          average: suggestedPrice,
          high: Math.round(suggestedPrice * 1.2),
        },
      };

      setOptimizationResults(results);
      setIsOptimizing(false);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const applyOptimizedPrice = () => {
    if (optimizationResults && onPriceUpdate) {
      onPriceUpdate(optimizationResults.suggestedPrice);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AttachMoneyIcon className="text-primary-600 dark:text-primary-400" />
            AI Pricing Optimizer
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get data-driven pricing recommendations
          </p>
        </div>
        {!optimizationResults && (
          <motion.button
            onClick={runOptimization}
            disabled={isOptimizing}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
              isOptimizing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 shadow-lg'
            }`}
            whileHover={!isOptimizing ? { scale: 1.02 } : {}}
            whileTap={!isOptimizing ? { scale: 0.98 } : {}}
          >
            {isOptimizing ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AutoGraphIcon fontSize="small" />
                Optimize Pricing
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Current Pricing Info */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
            Current Price
          </p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {formatCurrency(currentPrice)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">
            Industry
          </p>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-300">
            {industry}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
            Client Size
          </p>
          <p className="text-xl font-bold text-green-900 dark:text-green-300">
            {clientSize}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-1">
            Deal Size
          </p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
            {formatCurrency(dealSize)}
          </p>
        </div>
      </div>

      {/* Optimization Results */}
      {optimizationResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Recommended Price */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recommended Price
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on {optimizationResults.confidence}% confidence
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    optimizationResults.difference > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {optimizationResults.difference > 0 ? '+' : ''}
                  {optimizationResults.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(optimizationResults.suggestedPrice)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {optimizationResults.winProbability.toFixed(0)}% predicted
                  win probability
                </p>
              </div>

              {onPriceUpdate && (
                <motion.button
                  onClick={applyOptimizedPrice}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply This Price
                </motion.button>
              )}
            </div>
          </div>

          {/* Market Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Market Comparison
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Low Range', value: optimizationResults.marketComparison.low, color: 'bg-blue-500' },
                { label: 'Market Average', value: optimizationResults.marketComparison.average, color: 'bg-primary-500' },
                { label: 'High Range', value: optimizationResults.marketComparison.high, color: 'bg-purple-500' },
              ].map((range, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {range.label}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(range.value)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${range.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(range.value / optimizationResults.marketComparison.high) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              AI Insights & Recommendations
            </h4>
            <div className="space-y-3">
              {optimizationResults.insights.map((insight: any, index: number) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      insight.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 ${
                        insight.type === 'success'
                          ? 'text-green-600 dark:text-green-400'
                          : insight.type === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {insight.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={() => setOptimizationResults(null)}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Run New Optimization
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
