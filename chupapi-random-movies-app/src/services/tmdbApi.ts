import {
    DEFAULT_LANGUAGE,
    DEFAULT_REGION,
    RANDOM_PAGE_MAX,
    RANDOM_PAGE_MIN,
    TMDB_BASE_URL,
} from '../constants/media';
import type {
    AppMediaItem,
    MediaFilter,
    MediaType,
    TitleMode,
    TmdbDiscoverResponse,
    TmdbMovie,
    TmdbTvShow,
} from '../types/media';
import {
    getRandomItem,
    getRandomNumberBetween,
    mapMovieToAppMedia,
    mapTvShowToAppMedia,
} from '../utils/mediaMappers';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE || DEFAULT_LANGUAGE;
const REGION = import.meta.env.VITE_TMDB_REGION || DEFAULT_REGION;

const getRandomMediaType = (filter: MediaFilter): MediaType => {
    if (filter === 'movie') return 'movie';
    if (filter === 'tv') return 'tv';
    return Math.random() > 0.5 ? 'movie' : 'tv';
};

const buildUrl = (path: string, params: Record<string, string | number | boolean>): string => {
    const url = new URL(`${TMDB_BASE_URL}${path}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });

    return url.toString();
};

const validateApiKey = (): void => {
    // Coloca tu API Key en un archivo .env.local:
    // VITE_TMDB_API_KEY=TU_API_KEY_REAL
    if (!API_KEY || API_KEY === 'PEGAR_API_KEY_DE_TMDB_ACA') {
        throw new Error('Falta configurar VITE_TMDB_API_KEY en el archivo .env.local.');
    }
};

const tmdbFetch = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('TMDB rechazo la API Key. Revisa el valor de VITE_TMDB_API_KEY.');
        }

        throw new Error('No se pudo consultar TMDB en este momento.');
    }

    return response.json() as Promise<T>;
};

const getUniqueRandomItem = <T extends { id: number }>(items: T[], excludedIds: Set<string>, type: MediaType): T | null => {
    const filtered = items.filter((item) => !excludedIds.has(`${type}-${item.id}`));
    if (!filtered.length) return null;
    return getRandomItem(filtered);
};

const getMediaDetails = async (mediaType: MediaType, id: number): Promise<TmdbMovie | TmdbTvShow> => {
    const url = buildUrl(`/${mediaType}/${id}`, {
        api_key: API_KEY,
        language: LANGUAGE,
        region: REGION,
        append_to_response: 'translations',
    });

    return tmdbFetch<TmdbMovie | TmdbTvShow>(url);
};

export const getRandomMediaFromTmdb = async (
    filter: MediaFilter,
    titleMode: TitleMode,
    excludedIds: string[] = [],
): Promise<AppMediaItem> => {
    validateApiKey();

    const mediaType = getRandomMediaType(filter);
    const excludedSet = new Set(excludedIds);

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const page = getRandomNumberBetween(RANDOM_PAGE_MIN, RANDOM_PAGE_MAX);
        const url = buildUrl(`/discover/${mediaType}`, {
            api_key: API_KEY,
            language: LANGUAGE,
            region: REGION,
            include_adult: false,
            sort_by: 'popularity.desc',
            page,
        });

        const response = await tmdbFetch<TmdbDiscoverResponse<TmdbMovie | TmdbTvShow>>(url);

        if (!response.results.length) {
            continue;
        }

        const selectedItem = getUniqueRandomItem(response.results, excludedSet, mediaType);

        if (!selectedItem) {
            continue;
        }

        const mediaDetails = await getMediaDetails(mediaType, selectedItem.id);
        const mappedMedia =
            mediaType === 'movie'
                ? mapMovieToAppMedia(mediaDetails as TmdbMovie, titleMode)
                : mapTvShowToAppMedia(mediaDetails as TmdbTvShow, titleMode);

        if (mappedMedia) {
            return mappedMedia;
        }

        excludedSet.add(`${mediaType}-${selectedItem.id}`);
    }

    throw new Error('No se encontraron recomendaciones con ese idioma. Proba con modo mixto.');
};
