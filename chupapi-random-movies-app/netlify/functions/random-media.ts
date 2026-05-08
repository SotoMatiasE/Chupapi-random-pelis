type MediaType = 'movie' | 'tv';
type MediaFilter = 'mixed' | MediaType;
type TitleMode = 'spanish' | 'mixed';

interface RandomMediaRequest {
    filter?: MediaFilter;
    titleMode?: TitleMode;
    excludedIds?: string[];
}

interface AppMediaItem {
    id: number;
    type: MediaType;
    title: string;
    originalTitle: string;
    overview: string;
    posterUrl: string | null;
    backdropUrl: string | null;
    releaseYear: string;
    rating: number;
    popularity: number;
}

interface TmdbDiscoverResponse<T> {
    results: T[];
}

interface TmdbBaseMedia {
    id: number;
    overview: string;
    original_language: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    popularity: number;
    translations?: TmdbTranslations;
}

interface TmdbTranslation {
    iso_3166_1: string;
    iso_639_1: string;
    data: {
        title?: string;
        name?: string;
    };
}

interface TmdbTranslations {
    translations: TmdbTranslation[];
}

interface TmdbMovie extends TmdbBaseMedia {
    title: string;
    original_title: string;
    release_date: string;
}

interface TmdbTvShow extends TmdbBaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
}

interface NetlifyEvent {
    httpMethod: string;
    body: string | null;
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const LANGUAGE = process.env.TMDB_LANGUAGE || process.env.VITE_TMDB_LANGUAGE || 'es-MX';
const REGION = process.env.TMDB_REGION || process.env.VITE_TMDB_REGION || 'MX';
const RANDOM_PAGE_MIN = 1;
const RANDOM_PAGE_MAX = 15;

const jsonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

const getApiKey = (): string => {
    return process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY || '';
};

const getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
};

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

const tmdbFetch = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('TMDB rechazo la API Key. Revisa la variable TMDB_API_KEY en Netlify.');
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

const buildTmdbImageUrl = (path: string | null, size = 'w500'): string | null => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
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

const mapMovieToAppMedia = (movie: TmdbMovie, titleMode: TitleMode): AppMediaItem | null => {
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

const mapTvShowToAppMedia = (tvShow: TmdbTvShow, titleMode: TitleMode): AppMediaItem | null => {
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

const getMediaDetails = async (mediaType: MediaType, id: number, apiKey: string): Promise<TmdbMovie | TmdbTvShow> => {
    const url = buildUrl(`/${mediaType}/${id}`, {
        api_key: apiKey,
        language: LANGUAGE,
        region: REGION,
        append_to_response: 'translations',
    });

    return tmdbFetch<TmdbMovie | TmdbTvShow>(url);
};

const getRandomMedia = async (request: RandomMediaRequest): Promise<AppMediaItem> => {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'PEGAR_API_KEY_DE_TMDB_ACA') {
        throw new Error('Falta configurar TMDB_API_KEY en las variables de entorno de Netlify.');
    }

    const filter = request.filter ?? 'mixed';
    const titleMode = request.titleMode ?? 'spanish';
    const excludedSet = new Set(request.excludedIds ?? []);
    const mediaType = getRandomMediaType(filter);

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const page = getRandomNumberBetween(RANDOM_PAGE_MIN, RANDOM_PAGE_MAX);
        const url = buildUrl(`/discover/${mediaType}`, {
            api_key: apiKey,
            language: LANGUAGE,
            region: REGION,
            include_adult: false,
            sort_by: 'popularity.desc',
            page,
        });

        const response = await tmdbFetch<TmdbDiscoverResponse<TmdbMovie | TmdbTvShow>>(url);
        const selectedItem = getUniqueRandomItem(response.results, excludedSet, mediaType);

        if (!selectedItem) {
            continue;
        }

        const mediaDetails = await getMediaDetails(mediaType, selectedItem.id, apiKey);
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

export const handler = async (event: NetlifyEvent) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: jsonHeaders,
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: jsonHeaders,
            body: JSON.stringify({ error: 'Metodo no permitido.' }),
        };
    }

    try {
        const request = event.body ? (JSON.parse(event.body) as RandomMediaRequest) : {};
        const media = await getRandomMedia(request);

        return {
            statusCode: 200,
            headers: jsonHeaders,
            body: JSON.stringify({ media }),
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Ocurrio un error inesperado.';

        return {
            statusCode: 500,
            headers: jsonHeaders,
            body: JSON.stringify({ error: message }),
        };
    }
};
