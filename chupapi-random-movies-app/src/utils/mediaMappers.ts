import { TMDB_IMAGE_BASE_URL } from '../constants/media';
import type { AppMediaItem, MediaType, TitleMode, TmdbMovie, TmdbTranslation, TmdbTvShow } from '../types/media';

export const getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItem = <T,>(items: T[]): T => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
};

export const buildTmdbImageUrl = (path: string | null, size = 'w500'): string | null => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getMediaLabel = (type: MediaType): string => {
    return type === 'movie' ? 'Pelicula' : 'Serie';
};

const getYearFromDate = (date: string): string => {
    if (!date) return 'Sin anio';
    return date.slice(0, 4);
};

const getSpanishTranslationTitle = (translations: TmdbTranslation[] | undefined, key: 'title' | 'name'): string => {
    const spanishTranslations = translations?.filter((translation) => translation.iso_639_1 === 'es') ?? [];
    const latinSpanishTranslation = spanishTranslations.find((translation) =>
        ['MX', 'AR', 'US', 'CO', 'CL', 'PE', 'UY', 'VE'].includes(translation.iso_3166_1),
    );
    const translation = latinSpanishTranslation ?? spanishTranslations[0];

    return translation?.data[key]?.trim() ?? '';
};

const getMovieTitle = (movie: TmdbMovie, titleMode: TitleMode): string | null => {
    const spanishTitle = getSpanishTranslationTitle(movie.translations?.translations, 'title');
    const localizedTitle = movie.title;
    const fallbackTitle = movie.original_title || movie.title;

    if (titleMode === 'mixed') {
        return localizedTitle || fallbackTitle || null;
    }

    if (spanishTitle) return spanishTitle;
    if (movie.original_language === 'es') return fallbackTitle || null;

    return null;
};

const getTvShowTitle = (tvShow: TmdbTvShow, titleMode: TitleMode): string | null => {
    const spanishTitle = getSpanishTranslationTitle(tvShow.translations?.translations, 'name');
    const localizedTitle = tvShow.name;
    const fallbackTitle = tvShow.original_name || tvShow.name;

    if (titleMode === 'mixed') {
        return localizedTitle || fallbackTitle || null;
    }

    if (spanishTitle) return spanishTitle;
    if (tvShow.original_language === 'es') return fallbackTitle || null;

    return null;
};

export const mapMovieToAppMedia = (movie: TmdbMovie, titleMode: TitleMode): AppMediaItem | null => {
    const title = getMovieTitle(movie, titleMode);
    if (!title) return null;

    return {
        id: movie.id,
        type: 'movie',
        title,
        originalTitle: movie.original_title || movie.title || 'Sin titulo original',
        overview: '',
        posterUrl: buildTmdbImageUrl(movie.poster_path, 'w500'),
        backdropUrl: buildTmdbImageUrl(movie.backdrop_path, 'w780'),
        releaseYear: getYearFromDate(movie.release_date),
        rating: Number(movie.vote_average || 0),
        popularity: Number(movie.popularity || 0),
    };
};

export const mapTvShowToAppMedia = (tvShow: TmdbTvShow, titleMode: TitleMode): AppMediaItem | null => {
    const title = getTvShowTitle(tvShow, titleMode);
    if (!title) return null;

    return {
        id: tvShow.id,
        type: 'tv',
        title,
        originalTitle: tvShow.original_name || tvShow.name || 'Sin titulo original',
        overview: '',
        posterUrl: buildTmdbImageUrl(tvShow.poster_path, 'w500'),
        backdropUrl: buildTmdbImageUrl(tvShow.backdrop_path, 'w780'),
        releaseYear: getYearFromDate(tvShow.first_air_date),
        rating: Number(tvShow.vote_average || 0),
        popularity: Number(tvShow.popularity || 0),
    };
};
