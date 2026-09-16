import React, { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  // Зчитуємо збережену тему з localStorage або ставимо "light" за замовчуванням
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    // Встановлюємо data-атрибут для <html>
    document.documentElement.setAttribute('data-theme', theme);
    // Зберігаємо вибір у localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button 
      onClick={toggleTheme} 
      type="button"
      className="theme-toggle-btn"
      aria-label="Перемикач теми"
    >
      {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
    </button>
  );
};