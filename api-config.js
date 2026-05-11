const API_BASE_URL = 'http://localhost:5001/api';

const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LEADS: `${API_BASE_URL}/leads`,
    PROJECTS: `${API_BASE_URL}/projects`
};

window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: API_ENDPOINTS
};
