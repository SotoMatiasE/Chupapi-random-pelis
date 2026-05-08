import type { AppMediaItem, MediaFilter, TitleMode } from '../types/media';

interface RandomMediaRequest {
    filter: MediaFilter;
    titleMode: TitleMode;
    excludedIds: string[];
}

interface RandomMediaResponse {
    media?: AppMediaItem;
    error?: string;
}

export const getRandomMediaFromTmdb = async (
    filter: MediaFilter,
    titleMode: TitleMode,
    excludedIds: string[] = [],
): Promise<AppMediaItem> => {
    const requestBody: RandomMediaRequest = {
        filter,
        titleMode,
        excludedIds,
    };

    const response = await fetch('/.netlify/functions/random-media', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const data = (await response.json()) as RandomMediaResponse;

    if (!response.ok || !data.media) {
        throw new Error(data.error || 'No se pudo consultar TMDB en este momento.');
    }

    return data.media;
};
