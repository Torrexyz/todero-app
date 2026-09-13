import axios from "axios";

//====================//

const API_BASE_URL = "http://localhost:3001/api/dashboard/todo";

//====================//

const todoTaskAPI = {
  //..........//

  fetchTasks: async (data) => {
    const query = await axios.get(`${API_BASE_URL}/fetch-tasks/${data.userId}`);
    return query.data;
  },

  createTask: async (data) => {
    const query = await axios.post(`${API_BASE_URL}/create-task`, data);
    return query.data;
  },

  deleteTask: async (data) => {
    const query = await axios.delete(`${API_BASE_URL}/delete-task`, {
      data,
    });
    return query.data;
  },

  //..........//
};

//====================//

export default todoTaskAPI;
