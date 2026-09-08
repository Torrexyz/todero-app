import axios from "axios";

//====================//

const API_BASE_URL = "http://localhost:3001/api";

//====================//

const todoKanbanAPI = {
  //..........//

  fetchKbcolumns: async (projectId) => {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/todo/fetch-kbcolumns/${projectId}`,
    );
    return response.data;
  },

  //..........//
};

//====================//

export default todoKanbanAPI;
