import type { AppMediaItem } from '../types/media';
import { getMediaLabel } from '../utils/mediaMappers';

interface HistoryListProps {
    history: AppMediaItem[];
    onSelectMedia: (media: AppMediaItem) => void;
}

export const HistoryList = ({ history, onSelectMedia }: HistoryListProps) => {
    return (
        <section className="panel history-panel" aria-labelledby="history-title">
            <h2 id="history-title">Últimas tiradas</h2>

            {history.length === 0 ? (
                <p className="empty-message">Todavía no hay historial.</p>
            ) : (
                <div className="history-list">
                    {history.map((media) => (
                        <button
                            className="history-item"
                            key={`${media.type}-${media.id}`}
                            type="button"
                            onClick={() => onSelectMedia(media)}
                        >
                            {media.posterUrl ? (
                                <img src={media.posterUrl} alt="" aria-hidden="true" />
                            ) : (
                                <span className="history-item__placeholder">🎬</span>
                            )}

                            <span className="history-item__content">
                                <strong>{media.title}</strong>
                                <small>
                                    {getMediaLabel(media.type)} · {media.releaseYear} · ⭐ {media.rating.toFixed(1)}
                                </small>
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};