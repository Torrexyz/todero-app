import axios from "axios";

//====================//

const API_BASE_URL = "http://localhost:3001/api/dashboard/todo";

//====================//

const todoKanbanAPI = {
  //..........//

  fetchKbcolumns: async (data) => {
    const response = await axios.get(
      `${API_BASE_URL}/fetch-kbcolumns/${data.projectId}`,
    );
    return response.data;
  },

  //..........//
};

//====================//

export default todoKanbanAPI;
