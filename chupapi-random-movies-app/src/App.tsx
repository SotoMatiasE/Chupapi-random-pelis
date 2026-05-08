import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { ErrorBanner } from './components/ErrorBanner';
import { GameScreen } from './components/GameScreen';
import { MenuScreen } from './components/MenuScreen';
import { useRandomMedia } from './hooks/useRandomMedia';
import type { MediaFilter, TitleMode } from './types/media';
import './App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game'>('menu');
  const [selectedFilter, setSelectedFilter] = useState<MediaFilter>('mixed');
  const [selectedTitleMode, setSelectedTitleMode] = useState<TitleMode>('spanish');

  const {
    selectedMedia,
    isLoading,
    errorMessage,
    totalSpins,
    getRandomMedia,
    clearError,
    resetCurrentMedia,
  } = useRandomMedia();

  const handleStartGame = () => {
    resetCurrentMedia();
    setCurrentScreen('game');
  };

  const handleRandomClick = () => {
    void getRandomMedia(selectedFilter, selectedTitleMode);
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <main className="app-shell">
      <AppHeader totalSpins={totalSpins} />

      <ErrorBanner message={errorMessage} onClose={clearError} />

      {currentScreen === 'menu' ? (
        <MenuScreen
          selectedFilter={selectedFilter}
          selectedTitleMode={selectedTitleMode}
          onSelectFilter={setSelectedFilter}
          onSelectTitleMode={setSelectedTitleMode}
          onStartGame={handleStartGame}
        />
      ) : (
        <GameScreen
          media={selectedMedia}
          isLoading={isLoading}
          selectedFilter={selectedFilter}
          selectedTitleMode={selectedTitleMode}
          onRandomClick={handleRandomClick}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </main>
  );
};

export default App;
