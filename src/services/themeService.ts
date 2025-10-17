export interface Theme {
  name: string;
  key: string;
  type: 'light' | 'dark';
  colors?: Record<string, string>;
  properties?: Record<string, string>;
}

export interface ThemeConfig {
  name: string;
  type: 'light' | 'dark';
  colors: Record<string, string>;
  properties?: Record<string, string>;
}

class ThemeService {
  private static instance: ThemeService;
  private currentTheme: string = 'projectnest-default';
  private loadedThemes: Map<string, ThemeConfig> = new Map();

  private constructor() {
    this.initializeTheme();
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  private initializeTheme() {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }

    // Apply theme on initialization
    this.applyTheme(this.currentTheme);
  }

  public async loadTheme(themeKey: string): Promise<ThemeConfig | null> {
    if (this.loadedThemes.has(themeKey)) {
      return this.loadedThemes.get(themeKey) || null;
    }

    try {
      // Try to load theme from the themes folder
      const response = await fetch(`/themes/${themeKey}.json`);
      if (response.ok) {
        const themeConfig = await response.json();
        this.loadedThemes.set(themeKey, themeConfig);
        return themeConfig;
      }
    } catch (error) {
      console.warn(`Failed to load theme ${themeKey}:`, error);
    }

    // Fallback to built-in themes
    return this.getBuiltInTheme(themeKey);
  }

  private getBuiltInTheme(themeKey: string): ThemeConfig | null {
    const builtInThemes: Record<string, ThemeConfig> = {
      'projectnest-default': {
        name: 'ProjectNest Default',
        type: 'light',
        colors: {
          background: 'hsl(0, 0%, 98%)',
          foreground: 'hsl(0, 0%, 10%)',
          card: 'hsl(0, 0%, 100%)',
          cardForeground: 'hsl(0, 0%, 15%)',
          primary: 'hsl(0, 0%, 20%)',
          primaryForeground: 'hsl(0, 0%, 98%)',
          secondary: 'hsl(0, 0%, 95%)',
          secondaryForeground: 'hsl(0, 0%, 25%)',
          muted: 'hsl(0, 0%, 96%)',
          mutedForeground: 'hsl(0, 0%, 45%)',
          accent: 'hsl(0, 0%, 92%)',
          accentForeground: 'hsl(0, 0%, 20%)',
          border: 'hsl(0, 0%, 88%)',
          input: 'hsl(0, 0%, 95%)',
          ring: 'hsl(0, 0%, 20%)',
        },
      },
      'projectnest-dark': {
        name: 'ProjectNest Dark',
        type: 'dark',
        colors: {
          background: 'hsl(222.2, 84%, 4.9%)',
          foreground: 'hsl(210, 40%, 98%)',
          card: 'hsl(222.2, 84%, 4.9%)',
          cardForeground: 'hsl(210, 40%, 98%)',
          primary: 'hsl(210, 40%, 98%)',
          primaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
          secondary: 'hsl(217.2, 32.6%, 17.5%)',
          secondaryForeground: 'hsl(210, 40%, 98%)',
          muted: 'hsl(217.2, 32.6%, 17.5%)',
          mutedForeground: 'hsl(215, 20.2%, 65.1%)',
          accent: 'hsl(217.2, 32.6%, 17.5%)',
          accentForeground: 'hsl(210, 40%, 98%)',
          border: 'hsl(217.2, 32.6%, 17.5%)',
          input: 'hsl(217.2, 32.6%, 17.5%)',
          ring: 'hsl(212.7, 26.8%, 83.9%)',
        },
      },
    };

    return builtInThemes[themeKey] || null;
  }

  public async applyTheme(themeKey: string): Promise<void> {
    const theme = await this.loadTheme(themeKey);
    if (!theme) {
      console.warn(`Theme ${themeKey} not found, using default`);
      return;
    }

    const root = document.documentElement;

    // Apply dark/light class
    if (theme.type === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply CSS custom properties
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = this.convertToCSSVariable(key);
        root.style.setProperty(cssVar, value);
      });
    }

    if (theme.properties) {
      Object.entries(theme.properties).forEach(([key, value]) => {
        const cssVar = this.convertToCSSVariable(key);
        root.style.setProperty(cssVar, value);
      });
    }

    this.currentTheme = themeKey;
    localStorage.setItem('theme', themeKey);
  }

  private convertToCSSVariable(key: string): string {
    // Convert camelCase to kebab-case and add CSS variable prefix
    const kebabCase = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `--${kebabCase}`;
  }

  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  public async getAvailableThemes(): Promise<Theme[]> {
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch themes from API, using built-in themes');
    }

    // Fallback to built-in themes
    return [
      {
        name: 'ProjectNest Default',
        key: 'projectnest-default',
        type: 'light',
      },
      {
        name: 'ProjectNest Dark',
        key: 'projectnest-dark',
        type: 'dark',
      },
    ];
  }

  public preloadThemes(themeKeys: string[]): Promise<void[]> {
    return Promise.all(
      themeKeys.map(async (key) => {
        await this.loadTheme(key);
      })
    );
  }
}

export default ThemeService.getInstance();