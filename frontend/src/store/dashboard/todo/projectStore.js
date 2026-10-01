import { create } from "zustand";

//====================//

export const useProjectStore = create((set, get) => ({
  //..........//

  projects: {},
  loaded: false,
  error: null,
  isLoading: false,
  isFetching: false,

  //..........//

  setProjects: (projects) => set(() => ({ projects, loaded: true })),

  setError: (error) => set({ error }),

  setIsLoading: (isLoading) => set({ isLoading }),

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
      projects: {
        ...state.projects,
        [id]: { ...state.projects[id], ...data },
      },
    })),

  //..........//

  clearAll: () =>
    set({
      projects: {},
      loaded: false,
      error: null,
      isLoading: false,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
