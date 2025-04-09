import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = 'USD' | 'EUR' | 'RUB' | 'GBP';
export type Language = 'en' | 'ru';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
};

export const LANGUAGES = {
  en: { code: 'en', name: 'English' },
  ru: { code: 'ru', name: 'Russian' },
};

interface SettingsState {
  currency: Currency;
  language: Language;
  
  // Actions
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'USD',
      language: 'en',
      
      setCurrency: (currency: Currency) => set({ currency }),
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'kidcash-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);