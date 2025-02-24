import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { PortfolioProvider, usePortfolio } from '../../contexts/PortfolioContext';

/**
 * Portfolio Context Test Suite
 * 
 * Purpose:
 * Verify the Portfolio Context's ability to manage crypto assets securely and accurately.
 * 
 * Test Categories:
 * 1. Context Initialization
 * 2. Asset Management
 * 3. Data Persistence
 * 4. Error Handling
 *
 * @jest-environment jsdom
 */

// Mock EncryptedStorage
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Test utilities
const mockAsset = {
  id: 'btc',
  symbol: 'BTC',
  quantity: '1.5',
  purchasePrice: '45000'
};

// Test wrapper component
const TestComponent: React.FC<{ onMount?: () => void }> = ({ onMount }) => {
  const { portfolio, isLoading, error } = usePortfolio();
  React.useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <>
      {isLoading && <text>Loading...</text>}
      {error && <text>Error: {error}</text>}
      <text>Assets: {portfolio.length}</text>
      {portfolio.map(asset => (
        <text key={asset.id}>Symbol: {asset.symbol}</text>
      ))}
    </>
  );
};

/**
 * Test Suite: Context Initialization
 * Verifies proper initialization of the Portfolio Context
 */
describe('PortfolioContext - Initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty portfolio and loading state', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );

    await findByText('Loading...');
    await findByText('Assets: 0');
    
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('portfolio');
  });

  it('should load existing portfolio from storage', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([mockAsset])
    );

    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );

    await findByText('Assets: 1');
    await findByText('Symbol: BTC');
  });

  it('should handle storage errors gracefully', async () => {
    const mockError = new Error('Storage access denied');
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(mockError);

    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );

    await findByText('Error: Storage access denied');
  });
});

/**
 * Test Suite: Asset Management
 * Verifies proper handling of crypto asset operations
 */
describe('PortfolioContext - Asset Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should add new asset correctly', async () => {
    let addAsset: ((asset: typeof mockAsset) => Promise<void>) | null = null;
    
    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent onMount={() => {
          const { addAsset: add } = usePortfolio();
          addAsset = add;
        }} />
      </PortfolioProvider>
    );

    await findByText('Assets: 0');

    await act(async () => {
      await addAsset?.(mockAsset);
    });

    await findByText('Symbol: BTC');
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      'portfolio',
      JSON.stringify([mockAsset])
    );
  });

  it('should prevent duplicate assets', async () => {
    let addAsset: ((asset: typeof mockAsset) => Promise<void>) | null = null;
    let error: string | null = null;

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([mockAsset])
    );

    render(
      <PortfolioProvider>
        <TestComponent onMount={() => {
          const { addAsset: add, error: err } = usePortfolio();
          addAsset = add;
          error = err;
        }} />
      </PortfolioProvider>
    );

    await act(async () => {
      await addAsset?.(mockAsset);
    });

    expect(error).toBe('Asset already exists');
  });
});

/**
 * Test Suite: Data Persistence
 * Verifies proper data storage and retrieval
 */
describe('PortfolioContext - Data Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should persist portfolio changes', async () => {
    let addAsset: ((asset: typeof mockAsset) => Promise<void>) | null = null;
    
    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent onMount={() => {
          const { addAsset: add } = usePortfolio();
          addAsset = add;
        }} />
      </PortfolioProvider>
    );

    await act(async () => {
      await addAsset?.(mockAsset);
    });

    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      'portfolio',
      JSON.stringify([mockAsset])
    );
  });

  it('should handle storage failures', async () => {
    let addAsset: ((asset: typeof mockAsset) => Promise<void>) | null = null;
    
    (EncryptedStorage.setItem as jest.Mock).mockRejectedValue(
      new Error('Storage write failed')
    );

    const { findByText } = render(
      <PortfolioProvider>
        <TestComponent onMount={() => {
          const { addAsset: add } = usePortfolio();
          addAsset = add;
        }} />
      </PortfolioProvider>
    );

    await act(async () => {
      await addAsset?.(mockAsset);
    });

    await findByText('Error: Storage write failed');
  });
});


    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    // Wait for the useEffect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.assets).toEqual(mockStoredPortfolio);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add new asset', async () => {
    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await act(async () => {
      await result.current.addAsset(mockAsset);
    });

    expect(result.current.assets).toContainEqual(mockAsset);
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      'portfolio',
      JSON.stringify([mockAsset])
    );
  });

  it('should remove asset', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([mockAsset])
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await act(async () => {
      await Promise.resolve();
      await result.current.removeAsset('BTC');
    });

    expect(result.current.assets).toHaveLength(0);
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      'portfolio',
      JSON.stringify([])
    );
  });

  it('should update asset', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([mockAsset])
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    const updates = {
      quantity: 2,
      currentPrice: 55000,
    };

    await act(async () => {
      await Promise.resolve();
      await result.current.updateAsset('BTC', updates);
    });

    expect(result.current.assets[0]).toEqual({
      ...mockAsset,
      ...updates,
    });
  });

  it('should calculate total value correctly', async () => {
    const mockAssetWithPrice = {
      ...mockAsset,
      currentPrice: 55000,
    };

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([mockAssetWithPrice])
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.totalValue).toBe(55000); // 1 BTC * $55000
  });
});
