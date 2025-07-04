import { useStore } from 'effector-react';
import { $theme, toggleTheme } from '../../store/Theme/model';
import './index.scss';

export const ThemeToggle = () => {
  const theme = useStore($theme);

  return (
    <div className="theme-toggle">
      <button
        onClick={() => toggleTheme()}
        className={`theme-toggle__button ${theme === 'dark' ? 'theme-toggle__button--dark' : ''}`}
      >
        {theme === 'light' ? '🌞' : '🌙'}
      </button>
    </div>
  );
}; 