import React, { createContext, useContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Asset {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
}

interface PortfolioContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (symbol: string) => Promise<void>;
  updateAsset: (symbol: string, updates: Partial<Asset>) => Promise<void>;
  totalValue: number;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const storedPortfolio = await EncryptedStorage.getItem('portfolio');
      if (storedPortfolio) {
        setAssets(JSON.parse(storedPortfolio));
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePortfolio = async (updatedAssets: Asset[]) => {
    try {
      await EncryptedStorage.setItem('portfolio', JSON.stringify(updatedAssets));
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  };

  const addAsset = async (newAsset: Asset) => {
    const updatedAssets = [...assets, newAsset];
    await savePortfolio(updatedAssets);
    setAssets(updatedAssets);
  };

  const removeAsset = async (symbol: string) => {
    const updatedAssets = assets.filter(asset => asset.symbol !== symbol);
    await savePortfolio(updatedAssets);
    setAssets(updatedAssets);
  };

  const updateAsset = async (symbol: string, updates: Partial<Asset>) => {
    const updatedAssets = assets.map(asset =>
      asset.symbol === symbol ? { ...asset, ...updates } : asset
    );
    await savePortfolio(updatedAssets);
    setAssets(updatedAssets);
  };

  const totalValue = assets.reduce((total, asset) => {
    const currentValue = asset.currentPrice 
      ? asset.quantity * asset.currentPrice 
      : asset.quantity * asset.purchasePrice;
    return total + currentValue;
  }, 0);

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        addAsset,
        removeAsset,
        updateAsset,
        totalValue,
        isLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
