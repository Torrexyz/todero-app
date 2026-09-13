import { create } from "zustand";

//====================//

export const useProjectStore = create((set) => ({
  //..........//

  projects: {},
  loaded: false,

  //..........//

  setProjects: (projects) => set(() => ({ projects, loaded: true })),

  addProject: ({ id, data }) =>
    set((state) => ({
      projects: { ...state.projects, [id]: data },
    })),

  removeProject: (id) =>
    set((state) => {
      const newProjects = { ...state.projects };
      delete newProjects[id];
      return { projects: newProjects };
    }),

  clearAll: () => set({ projects: {}, loaded: false }),

  //..........//
}));
