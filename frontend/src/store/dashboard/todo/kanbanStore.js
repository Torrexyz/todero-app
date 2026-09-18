import { create } from "zustand";

//====================//

export const useKanbanStore = create((set, get) => ({
  //..........//

  kanban: {},
  loaded: false,
  loading: false,
  error: null,
  isFetching: false,

  //..........//

  setKbcolumns: (kanban) => set(() => ({ kanban, loaded: true })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setIsFetching: (isFetching) => set({ isFetching }),

  //..........//

  addKbcolumn: (id, data) =>
    set((state) => ({
      kanban: { ...state.kanban, [id]: data },
    })),

  removeKbcolumn: (id) =>
    set((state) => {
      const newKanban = { ...state.kanban };
      delete newKanban[id];
      return { kanban: newKanban };
    }),

  modifyKanban: (id, data) =>
    set((state) => ({
      kanban: { ...state.kanban, [id]: { ...state.kanban[id], ...data } },
    })),

  //..........//

  clearAll: () =>
    set({
      kanban: {},
      loaded: false,
      loading: false,
      error: null,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
