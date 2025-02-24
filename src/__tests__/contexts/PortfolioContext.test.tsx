import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { PortfolioProvider, usePortfolio } from '../../contexts/PortfolioContext';
import EncryptedStorage from 'react-native-encrypted-storage';

// Mock EncryptedStorage
jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('PortfolioContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PortfolioProvider>{children}</PortfolioProvider>
  );

  const mockAsset = {
    symbol: 'BTC',
    quantity: 1,
    purchasePrice: 50000,
  };

  it('should load portfolio from storage on mount', async () => {
    const mockStoredPortfolio = [mockAsset];
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockStoredPortfolio)
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
