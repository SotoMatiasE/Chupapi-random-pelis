import type { AppMediaItem } from '../types/media';
import { getMediaLabel } from '../utils/mediaMappers';

interface MediaCardProps {
    media: AppMediaItem | null;
    isLoading: boolean;
    onRandomClick: () => void;
}

export const MediaCard = ({ media, isLoading, onRandomClick }: MediaCardProps) => {
    if (!media) {
        return (
            <section className="media-empty-card">
                <div className="media-empty-card__icon">?</div>
                <h2>Empeza tu primera tirada</h2>
                <button className="primary-button" type="button" disabled={isLoading} onClick={onRandomClick}>
                    {isLoading ? 'Buscando...' : 'Random'}
                </button>
            </section>
        );
    }

    const imageUrl = media.posterUrl || media.backdropUrl;

    return (
        <article className="media-card">
            <div className="media-card__poster-wrapper">
                {imageUrl ? (
                    <img className="media-card__poster" src={imageUrl} alt={`Poster de ${media.title}`} />
                ) : (
                    <div className="media-card__poster-placeholder">Sin imagen</div>
                )}
            </div>

            <div className="media-card__body">
                <div className="chip-list" aria-label="Informacion principal">
                    <span className="chip">{getMediaLabel(media.type)}</span>
                    <span className="chip">{media.releaseYear}</span>
                </div>

                <h2>{media.title}</h2>
            </div>
        </article>
    );
};
