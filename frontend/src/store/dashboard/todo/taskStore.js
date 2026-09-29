import { create } from "zustand";

//====================//

export const useTaskStore = create((set, get) => ({
  //..........//

  tasks: {},
  loaded: false,
  loading: false,
  error: null,
  isFetching: false,

  //..........//

  setTasks: (tasks) => set(() => ({ tasks, loaded: true })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setIsFetching: (isFetching) => set({ isFetching }),

  //..........//

  addTask: (id, data) =>
    set((state) => ({
      tasks: { ...state.tasks, [id]: data },
    })),

  removeTask: (id) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[id];
      return { tasks: newTasks };
    }),

  modifyTask: (id, data) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [id]: { ...state.tasks[id], ...data },
      },
    })),

  //..........//

  clearAll: () =>
    set({
      tasks: {},
      loaded: false,
      loading: false,
      error: null,
      isFetching: false,
    }),

  getState: () => get(),

  //..........//
}));
