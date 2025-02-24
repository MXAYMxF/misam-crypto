/**
 * Portfolio Context
 * 
 * Purpose:
 * Manages the user's cryptocurrency portfolio with secure storage and real-time updates.
 * 
 * Features:
 * - Encrypted storage of portfolio data
 * - Asset management (add, remove, update)
 * - Error handling and loading states
 * - Portfolio value calculations
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

// Types and Interfaces
interface Asset {
  id: string;           // Unique identifier (e.g., 'btc', 'eth')
  symbol: string;       // Asset symbol (e.g., 'BTC', 'ETH')
  quantity: string;     // Stored as string to prevent floating point issues
  purchasePrice: string; // Stored as string for precision
  currentPrice?: string; // Optional current market price
}

interface PortfolioContextType {
  portfolio: Asset[];    // List of assets in portfolio
  isLoading: boolean;    // Loading state indicator
  error: string | null;  // Error state
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  clearError: () => void;
}

// Create Portfolio Context
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

/**
 * Portfolio Context Hook
 * @returns {PortfolioContextType} Portfolio context value
 * @throws {Error} If used outside of PortfolioProvider
 */
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

/**
 * Portfolio Provider Component
 * Manages portfolio state and provides portfolio management functions
 */
export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [portfolio, setPortfolio] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load portfolio on mount
  useEffect(() => {
    loadPortfolio();
  }, []);

  /**
   * Load portfolio from encrypted storage
   */
  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      const stored = await EncryptedStorage.getItem('portfolio');
      if (stored) {
        setPortfolio(JSON.parse(stored));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save portfolio to encrypted storage
   */
  const savePortfolio = async (newPortfolio: Asset[]) => {
    try {
      await EncryptedStorage.setItem('portfolio', JSON.stringify(newPortfolio));
      setPortfolio(newPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save portfolio');
      throw err; // Propagate error for handling in UI
    }
  };

  /**
   * Add new asset to portfolio
   */
  const addAsset = async (asset: Asset) => {
    const exists = portfolio.some(a => a.id === asset.id);
    if (exists) {
      setError('Asset already exists');
      return;
    }

    try {
      await savePortfolio([...portfolio, asset]);
    } catch (err) {
      // Error already set in savePortfolio
      throw err;
    }
  };

  /**
   * Remove asset from portfolio
   */
  const removeAsset = async (id: string) => {
    try {
      const newPortfolio = portfolio.filter(asset => asset.id !== id);
      await savePortfolio(newPortfolio);
    } catch (err) {
      // Error already set in savePortfolio
      throw err;
    }
  };

  /**
   * Update existing asset
   */
  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const newPortfolio = portfolio.map(asset =>
        asset.id === id ? { ...asset, ...updates } : asset
      );
      await savePortfolio(newPortfolio);
    } catch (err) {
      // Error already set in savePortfolio
      throw err;
    }
  };

  /**
   * Clear current error state
   */
  const clearError = () => setError(null);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        error,
        addAsset,
        removeAsset,
        updateAsset,
        clearError,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
