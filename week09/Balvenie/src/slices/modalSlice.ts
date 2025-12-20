import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state): void => {
      state.isOpen = true;
    },
    closeModal: (state): void => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

// duck pattern reducer는 export default로 내보내야함
const modalReducer = modalSlice.reducer;

export default modalReducer;