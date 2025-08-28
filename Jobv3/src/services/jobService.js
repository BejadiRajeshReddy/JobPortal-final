// Job Service - Handles all job-related operations
const API_BASE_URL = 'http://localhost:8080/auth/api';

class JobService {
  // Get JWT token from localStorage
  getAuthToken() {
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('X-AUTH-TOKEN') || localStorage.getItem('authToken');
    return token;
  }

  // Make authenticated API request
  async makeRequest(endpoint, method = 'GET', data = null) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all jobs from MongoDB (for public display)
  async getAllJobs() {
    try {
      // Try to get from MongoDB first
      const response = await this.makeRequest('/getAllJobs', 'GET');
        return response.result;
    } catch (error) {
      console.log(error.message);
    }
  }

  // Get jobs for a specific recruiter
  async getRecruiterJobs(recruiterId) {
    try {
      const response = await this.makeRequest('/getJoblist', 'POST', { user_id: recruiterId });
      if (response && response.result) {
        return response.result;
      } else if (response && response.data) {
        return response.data;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.log(error.message);
    }
  }

  // Insert new job
  async insertJob(jobData) {
    try {
      const response = await this.makeRequest('/insertJob', 'POST', jobData);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  async getUsersData(jobData) {
    try {
      const response = await this.makeRequest('/userprofile', 'GET', jobData);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  async updateUserData(userData) {
    try {
      const response = await this.makeRequest('/userprofile', 'GET', userData);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  // Update existing job
  async updateJob(jobData) {
    try {
      const response = await this.makeRequest('/updateJob', 'POST', jobData);
      
      return response;
    } catch (error) {
      console.log(error.message);
      return jobData;
    }
  }


  // Delete job
  async deleteJob(jobId) {
    try {
      // Try to delete from MongoDB
      await this.makeRequest('/deleteJob', 'POST', { jobId });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/testApi`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new JobService();
