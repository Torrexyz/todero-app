import axios from "axios";

//====================//

const API_BASE_URL = "http://localhost:3001/api/dashboard/todo";

//====================//

const todoTaskAPI = {
  //..........//

  fetchTasks: async ({ userId, projectId }) => {
    const query = await axios.get(
      `${API_BASE_URL}/fetch-tasks?userId=${userId}&projectId=${projectId}`,
    );
    return query.data;
  },

  createTask: async (data) => {
    const query = await axios.post(`${API_BASE_URL}/create-task`, data);
    return query.data;
  },

  //..........//
};

//====================//

export default todoTaskAPI;
