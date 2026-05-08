import { useCallback, useRef, useState } from 'react';
import { getRandomMediaFromTmdb } from '../services/tmdbApi';
import type { MediaFilter, RandomMediaState, TitleMode } from '../types/media';

const initialState: RandomMediaState = {
    selectedMedia: null,
    isLoading: false,
    errorMessage: '',
    totalSpins: 0,
};

export const useRandomMedia = () => {
    const selectedMediaIdsRef = useRef<Set<string>>(new Set());
    const [state, setState] = useState<RandomMediaState>(initialState);

    const getRandomMedia = useCallback(async (filter: MediaFilter, titleMode: TitleMode) => {
        setState((prevState) => ({
            ...prevState,
            isLoading: true,
            errorMessage: '',
        }));

        try {
            const excludedIds = Array.from(selectedMediaIdsRef.current);
            const media = await getRandomMediaFromTmdb(filter, titleMode, excludedIds);

            selectedMediaIdsRef.current.add(`${media.type}-${media.id}`);

            setState((prevState) => ({
                ...prevState,
                selectedMedia: media,
                totalSpins: prevState.totalSpins + 1,
                isLoading: false,
                errorMessage: '',
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ocurrio un error inesperado.';

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                errorMessage: message,
            }));
        }
    }, []);

    const clearError = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            errorMessage: '',
        }));
    }, []);

    const resetCurrentMedia = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            selectedMedia: null,
            errorMessage: '',
        }));
    }, []);

    return {
        selectedMedia: state.selectedMedia,
        isLoading: state.isLoading,
        errorMessage: state.errorMessage,
        totalSpins: state.totalSpins,
        getRandomMedia,
        clearError,
        resetCurrentMedia,
    };
};
