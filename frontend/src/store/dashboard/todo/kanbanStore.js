import { create } from "zustand";

//====================//

export const useKanbanStore = create((set, get) => ({
  //..........//

  kbcolumns: {},
  loaded: false,
  loading: false,
  error: null,
  isFetching: false,

  //..........//

  setKbcolumns: (kbcolumns) => set(() => ({ kbcolumns, loaded: true })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

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
      loading: false,
      error: null,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
