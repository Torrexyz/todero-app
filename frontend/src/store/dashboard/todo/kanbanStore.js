import { create } from "zustand";

//====================//

export const useKanbanStore = create((set) => ({
  //..........//

  kanban: {},

  //..........//

  setProjects: (kanban) => set(() => ({ kanban })),

  addProject: (kanban) =>
    set((state) => ({ kanban: { ...state.projects, [kanban.id]: kanban } })),

  removeProject: (id) =>
    set((state) => {
      const newKanban = { ...state.kanban };
      delete newKanban[id];
      return { kanban: newKanban };
    }),

  clear: () => set({ kanban: {} }),

  //..........//
}));
