export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5005/api'
    : '/api';

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LEADS: `${API_BASE_URL}/leads`,
    PROJECTS: `${API_BASE_URL}/projects`
};
