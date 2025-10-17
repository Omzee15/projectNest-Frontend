import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import themeService, { Theme } from '../services/themeService';

interface ThemeContextType {
  currentTheme: string;
  availableThemes: Theme[];
  setTheme: (themeKey: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>(themeService.getCurrentTheme());
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeThemes = async () => {
      try {
        // Load available themes
        const themes = await themeService.getAvailableThemes();
        setAvailableThemes(themes);

        // Preload all themes for faster switching
        const themeKeys = themes.map(t => t.key);
        await themeService.preloadThemes(themeKeys);

        // Apply current theme
        await themeService.applyTheme(currentTheme);
      } catch (error) {
        console.error('Failed to initialize themes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeThemes();
  }, [currentTheme]);

  const setTheme = async (themeKey: string): Promise<void> => {
    try {
      await themeService.applyTheme(themeKey);
      setCurrentTheme(themeKey);
    } catch (error) {
      console.error('Failed to set theme:', error);
      throw error;
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};