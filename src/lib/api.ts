// Central API configuration — reads from Vite env variable
// In development: http://localhost:5000 (from .env)
// In production: https://unblockedgameszone.com (from .env.production)
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
