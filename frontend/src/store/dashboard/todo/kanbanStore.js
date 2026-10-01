import { create } from "zustand";

//====================//

export const useKanbanStore = create((set, get) => ({
  //..........//

  kbcolumns: {},
  loaded: false,
  error: null,
  isLoading: false,
  isFetching: false,

  //..........//

  setKbcolumns: (kbcolumns) => set(() => ({ kbcolumns, loaded: true })),

  setError: (error) => set({ error }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsFetching: (isFetching) => set({ isFetching }),

  //..........//

  addKbcolumn: (id, data) =>
    set((state) => ({
      kbcolumns: { ...state.kbcolumns, [id]: data },
    })),

  removeKbcolumn: (id) =>
    set((state) => {
      const newKanban = { ...state.kbcolumns };
      delete newKanban[id];
      return { kbcolumns: newKanban };
    }),

  modifyKbcolumn: (id, data) =>
    set((state) => ({
      kbcolumns: {
        ...state.kbcolumns,
        [id]: { ...state.kbcolumns[id], ...data },
      },
    })),

  //..........//

  clearAll: () =>
    set({
      kbcolumns: {},
      loaded: false,
      error: null,
      isLoading: false,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
