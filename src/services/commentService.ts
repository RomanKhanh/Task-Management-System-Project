import axios from "axios";

const API_URL = "http://localhost:5000/api/comments";

export const commentService = {

  getCommentsByTask: async (taskId: number) => {
    const res = await axios.get(`${API_URL}/task/${taskId}`);
    return res.data;
  },

  createComment: async (data: any) => {
    const res = await axios.post(API_URL, data);
    return res.data;
  }

};