// Centralized API configuration for live deployment
const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000';

// Remove trailing slash if present
const cleanUrl = rawApiUrl.replace(/\/+$/, '');

// Base server URL (without /api path)
export const API_SERVER_URL = cleanUrl.endsWith('/api')
  ? cleanUrl.slice(0, -4)
  : cleanUrl;

// API endpoint URL (ending with /api)
export const API_URL = cleanUrl.endsWith('/api')
  ? cleanUrl
  : `${cleanUrl}/api`;
