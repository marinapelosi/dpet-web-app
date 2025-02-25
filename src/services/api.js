import axios from "axios";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async post(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  handleError(error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
}

export default new ApiService();
