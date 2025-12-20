import {
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RooteState } from "../store/store";

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useAppSelector: TypedUseSelectorHook<RooteState> =
  useDefaultSelector;
