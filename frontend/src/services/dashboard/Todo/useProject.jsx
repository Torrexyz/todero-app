import axios from "axios";

//====================//

const API_BASE_URL = "http://localhost:3001/api/dashboard/todo";

//====================//

const todoProjectAPI = {
  //..........//

  fetchProjects: async ({ userId }) => {
    const query = await axios.get(`${API_BASE_URL}/fetch-projects/${userId}`);
    return query.data;
  },

  createProject: async (data) => {
    const query = await axios.post(`${API_BASE_URL}/create-project`, data);
    return query.data;
  },

  deleteProject: async (data) => {
    const query = await axios.delete(`${API_BASE_URL}/delete-project`, {
      data,
    });
    return query.data;
  },

  //..........//
};

//====================//

export default todoProjectAPI;
