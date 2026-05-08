import type { MediaFilter, TitleMode } from '../types/media';

interface MenuScreenProps {
  selectedFilter: MediaFilter;
  selectedTitleMode: TitleMode;
  onSelectFilter: (filter: MediaFilter) => void;
  onSelectTitleMode: (titleMode: TitleMode) => void;
  onStartGame: () => void;
}

const recommendationOptions: Array<{
  value: MediaFilter;
  title: string;
  kicker: string;
}> = [
  {
    value: 'mixed',
    title: 'Peliculas y series',
    kicker: 'Caos total',
  },
  {
    value: 'movie',
    title: 'Solo peliculas',
    kicker: 'Modo cine',
  },
  {
    value: 'tv',
    title: 'Solo series',
    kicker: 'Maraton express',
  },
];

const titleModeOptions: Array<{
  value: TitleMode;
  title: string;
  kicker: string;
}> = [
  {
    value: 'spanish',
    title: 'Solo espanol',
    kicker: 'Traducidos',
  },
  {
    value: 'mixed',
    title: 'Mixto',
    kicker: 'Originales ok',
  },
];

export const MenuScreen = ({
  selectedFilter,
  selectedTitleMode,
  onSelectFilter,
  onSelectTitleMode,
  onStartGame,
}: MenuScreenProps) => {
  return (
    <section className="menu-screen">
      <div className="menu-content">
        <div className="hero-lockup">
          <span className="eyebrow">Juego de mimica</span>
          <h1 className="menu-title">Tipo de recomendacion</h1>
          <p className="menu-subtitle">Elegi el mazo, el idioma de los titulos y que alguien actue sin hablar.</p>
        </div>

        <div className="menu-stack">
          <div className="menu-options" aria-label="Tipo de recomendacion">
            <span className="menu-group-label">Recomendacion</span>
            <div className="option-buttons">
              {recommendationOptions.map((option) => {
                const isSelected = selectedFilter === option.value;

                return (
                  <button
                    key={option.value}
                    className={`option-button${isSelected ? ' option-button--active' : ''}`}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectFilter(option.value)}
                  >
                    <span className="option-kicker">{option.kicker}</span>
                    <span className="option-text">{option.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="menu-options" aria-label="Idioma de titulos">
            <span className="menu-group-label">Titulos</span>
            <div className="option-buttons option-buttons--compact">
              {titleModeOptions.map((option) => {
                const isSelected = selectedTitleMode === option.value;

                return (
                  <button
                    key={option.value}
                    className={`option-button option-button--compact${isSelected ? ' option-button--active' : ''}`}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectTitleMode(option.value)}
                  >
                    <span className="option-kicker">{option.kicker}</span>
                    <span className="option-text">{option.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button className="play-button" type="button" onClick={onStartGame}>
          Jugar
        </button>
      </div>
    </section>
  );
};
