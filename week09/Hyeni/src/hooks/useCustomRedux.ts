import {
    useDispatch as useDefaultDispatch,
    useSelector as useDefaultSelector,
    type TypedUseSelectorHook,
} from 'react-redux';
import type { AppDispatch, RootState } from '../stores/store';

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelecter: TypedUseSelectorHook<RootState> = useDefaultSelector;