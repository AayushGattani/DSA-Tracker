import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Question APIs
export const questionAPI = {
  addQuestion: (data) => api.post('/questions', data),
  getAllQuestions: (params) => api.get('/questions', { params }),
  getQuestionById: (id) => api.get(`/questions/${id}`),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  getStatistics: () => api.get('/questions/statistics')
};

// Revision APIs
export const revisionAPI = {
  getTodayRevisions: () => api.get('/revisions/today'),
  getRevisionsByDate: (date) => api.get('/revisions/by-date', { params: { date } }),
  getUpcomingRevisions: (days) => api.get('/revisions/upcoming', { params: { days } }),
  markRevisionCompleted: (id) => api.patch(`/revisions/${id}/complete`),
  markMultipleRevisionsCompleted: (revisionIds) => api.patch('/revisions/complete-multiple', { revisionIds }),
  resetRevision: (id) => api.patch(`/revisions/${id}/reset`),
  getQuestionRevisionHistory: (questionId) => api.get(`/revisions/question/${questionId}`)
};

// Settings APIs
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateReminderPattern: (reminderPattern, applyOption, customDate) => 
    api.patch('/settings/reminder-pattern', { reminderPattern, applyOption, customDate }),
  updateProfile: (name) => api.patch('/settings/profile', { name }),
  getStreak: () => api.get('/settings/streak'),
  getContributionGraph: () => api.get('/settings/contribution-graph')
};

export default api;
