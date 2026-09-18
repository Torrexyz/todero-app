import { create } from "zustand";

//====================//

export const useProjectStore = create((set, get) => ({
  //..........//

  projects: {},
  loaded: false,
  loading: false,
  error: null,
  isFetching: false,

  //..........//

  setProjects: (projects) => set(() => ({ projects, loaded: true })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setIsFetching: (isFetching) => set({ isFetching }),

  //..........//

  addProject: (id, data) =>
    set((state) => ({
      projects: { ...state.projects, [id]: data },
    })),

  removeProject: (id) =>
    set((state) => {
      const newProjects = { ...state.projects };
      delete newProjects[id];
      return { projects: newProjects };
    }),

  modifyProject: (id, data) =>
    set((state) => ({
      projects: { ...state.projects, [id]: { ...state.projects[id], ...data } },
    })),

  //..........//

  clearAll: () =>
    set({
      projects: {},
      loaded: false,
      loading: false,
      error: null,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
