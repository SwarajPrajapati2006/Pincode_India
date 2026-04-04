import axios from "axios";

// In production on Netlify, we will supply VITE_API_URL (e.g. https://my-backend.onrender.com/api)
// In local development, import.meta.env.VITE_API_URL will be undefined, so it falls back to "/api" 
// which is intercepted by the vite proxy in vite.config.js
const API_URL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({ baseURL: API_URL });

// ─── Location Hierarchy ───
export const fetchStates = () => API.get("/states").then((r) => r.data);
export const fetchDistricts = (state) =>
  API.get(`/states/${encodeURIComponent(state)}/districts`).then((r) => r.data);
export const fetchTaluks = (state, district) =>
  API.get(
    `/states/${encodeURIComponent(state)}/districts/${encodeURIComponent(district)}/taluks`
  ).then((r) => r.data);

// ─── Pincodes ───
export const fetchPincodes = (params) =>
  API.get("/pincodes", { params }).then((r) => r.data);

// ─── Search ───
export const searchPincodes = (q) =>
  API.get("/search", { params: { q } }).then((r) => r.data);

// ─── Single Pincode ───
export const fetchPincodeDetail = (pincode) =>
  API.get(`/pincode/${pincode}`).then((r) => r.data);

// ─── Stats ───
export const fetchStats = () => API.get("/stats").then((r) => r.data);
export const fetchStateDistribution = () =>
  API.get("/stats/state-distribution").then((r) => r.data);
export const fetchDeliveryDistribution = () =>
  API.get("/stats/delivery-distribution").then((r) => r.data);

// ─── Export ───
export const getExportURL = (params) => {
  const query = new URLSearchParams(params).toString();
  // Ensure we append the query cleanly depending on if API_URL has a trailing slash
  const urlBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${urlBase}/export?${query}`;
};
