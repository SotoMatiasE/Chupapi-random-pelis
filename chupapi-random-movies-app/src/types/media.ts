export type MediaType = 'movie' | 'tv';
export type MediaFilter = 'mixed' | MediaType;
export type TitleMode = 'spanish' | 'mixed';

export interface AppMediaItem {
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

export interface TmdbDiscoverResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TmdbBaseMedia {
    id: number;
    overview: string;
    original_language: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    popularity: number;
    translations?: TmdbTranslations;
}

export interface TmdbTranslation {
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    english_name: string;
    data: {
        title?: string;
        name?: string;
    };
}

export interface TmdbTranslations {
    translations: TmdbTranslation[];
}

export interface TmdbMovie extends TmdbBaseMedia {
    title: string;
    original_title: string;
    release_date: string;
}

export interface TmdbTvShow extends TmdbBaseMedia {
    name: string;
    original_name: string;
    first_air_date: string;
}

export interface RandomMediaState {
    selectedMedia: AppMediaItem | null;
    isLoading: boolean;
    errorMessage: string;
    totalSpins: number;
}
