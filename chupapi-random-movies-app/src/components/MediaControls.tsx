import type { MediaFilter } from '../types/media';

interface MediaControlsProps {
    selectedFilter: MediaFilter;
    isLoading: boolean;
    onChangeFilter: (filter: MediaFilter) => void;
    onRandomClick: () => void;
}

export const MediaControls = ({
    selectedFilter,
    isLoading,
    onChangeFilter,
    onRandomClick,
}: MediaControlsProps) => {
    return (
        <section className="panel controls-panel" aria-labelledby="controls-title">
            <h2 id="controls-title">Configuración</h2>

            <label className="field-label" htmlFor="media-filter">
                Elegi como jugar
            </label>

            <select
                id="media-filter"
                className="select-input"
                value={selectedFilter}
                onChange={(event) => onChangeFilter(event.target.value as MediaFilter)}
            >
                <option value="mixed">Películas y series</option>
                <option value="movie">Solo películas</option>
                <option value="tv">Solo series</option>
            </select>

            <button className="primary-button" type="button" disabled={isLoading} onClick={onRandomClick}>
                {isLoading ? 'Buscando...' : 'Elegir random'}
            </button>

            <p className="helper-text">
                Los resultados se piden en español usando la configuración de idioma del archivo .env.local.
            </p>
        </section>
    );
};