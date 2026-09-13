import { create } from "zustand";

//====================//

export const useTaskStore = create((set) => ({
  //..........//

  tasks: {},
  loaded: false,

  //..........//

  setTasks: (tasks) => set(() => ({ tasks, loaded: true })),

  addTask: ({ id, data }) =>
    set((state) => ({ tasks: { ...state.tasks, [id]: data } })),

  removeTask: (id) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[id];
      return { tasks: newTasks };
    }),

  clearAll: () => set({ tasks: {}, loaded: false }),

  //..........//
}));
