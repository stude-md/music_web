// API configuration

// Determine base URL based on environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, use relative path (/api)
  : 'http://localhost:5000/api'; // In development, use localhost

export default baseURL;
