import type { AppMediaItem, MediaFilter, TitleMode } from '../types/media';

interface GameScreenProps {
  media: AppMediaItem | null;
  isLoading: boolean;
  selectedFilter: MediaFilter;
  selectedTitleMode: TitleMode;
  onRandomClick: () => void;
  onBackToMenu: () => void;
}

const filterLabel: Record<MediaFilter, string> = {
  mixed: 'Peliculas y series',
  movie: 'Solo peliculas',
  tv: 'Solo series',
};

export const GameScreen = ({
  media,
  isLoading,
  selectedFilter,
  selectedTitleMode,
  onRandomClick,
  onBackToMenu,
}: GameScreenProps) => {
  return (
    <section className="game-screen">
      <div className="game-topbar">
        <button className="back-button" type="button" onClick={onBackToMenu} aria-label="Volver al menu">
          Volver
        </button>
        <span className="mode-pill">
          {filterLabel[selectedFilter]} / {selectedTitleMode === 'spanish' ? 'Solo espanol' : 'Mixto'}
        </span>
      </div>

      <div className="game-content">
        <div className={`poster-stage${media ? '' : ' poster-stage--empty'}`}>
          {media?.posterUrl ? (
            <img className="media-image" src={media.posterUrl} alt={`Poster de ${media.title}`} />
          ) : (
            <div className="media-placeholder">
              <span className="placeholder-mark">?</span>
            </div>
          )}
        </div>

        <div className="guess-panel" aria-live="polite">
          <span className="round-label">{media ? 'Tu pelicula es' : 'Listo para actuar'}</span>
          <h2 className="media-title">{media?.title ?? 'Toca Random'}</h2>
        </div>

        <button className="random-button" type="button" disabled={isLoading} onClick={onRandomClick}>
          {isLoading ? 'Buscando...' : 'Random'}
        </button>
      </div>
    </section>
  );
};
