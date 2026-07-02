import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ── Public ──────────────────────────────────────────────
export const fetchNews = (category) =>
  api.get('/news', { params: category ? { category } : {} }).then(r => r.data);

export const fetchTrendingNews = () =>
  api.get('/news/trending').then(r => r.data);

export const fetchArticle = (slug) =>
  api.get(`/news/${slug}`).then(r => r.data);

export const fetchCategories = () =>
  api.get('/categories').then(r => r.data);

export const fetchBreakingNews = () =>
  api.get('/breaking-news').then(r => r.data);

// ── Admin: Stats ─────────────────────────────────────────
export const adminFetchStats = () =>
  api.get('/news/admin/stats').then(r => r.data);

// ── Admin: News ──────────────────────────────────────────
export const adminFetchNews = () =>
  api.get('/news/admin/all').then(r => r.data);

export const adminFetchTrending = () =>
  api.get('/news/admin/trending').then(r => r.data);

export const adminCreateNews = (data) =>
  api.post('/news', data).then(r => r.data);

export const adminUpdateNews = (id, data) =>
  api.put(`/news/${id}`, data).then(r => r.data);

export const adminDeleteNews = (id) =>
  api.delete(`/news/${id}`).then(r => r.data);

// ── Admin: Categories ────────────────────────────────────
export const adminCreateCategory = (data) =>
  api.post('/categories', data).then(r => r.data);

export const adminUpdateCategory = (id, data) =>
  api.put(`/categories/${id}`, data).then(r => r.data);

export const adminDeleteCategory = (id) =>
  api.delete(`/categories/${id}`).then(r => r.data);

// ── Admin: Breaking News ─────────────────────────────────
export const adminFetchBreakingNews = () =>
  api.get('/breaking-news/admin/all').then(r => r.data);

export const adminCreateBreakingNews = (data) =>
  api.post('/breaking-news', data).then(r => r.data);

export const adminUpdateBreakingNews = (id, data) =>
  api.put(`/breaking-news/${id}`, data).then(r => r.data);

export const adminDeleteBreakingNews = (id) =>
  api.delete(`/breaking-news/${id}`).then(r => r.data);

// ── Auth ──────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const adminMe = (token) =>
  api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// ── Public: E-Paper ──────────────────────────────────────
export const fetchEpapers = () =>
  api.get('/epaper').then(r => r.data);

export const fetchEpaperByDate = (date) =>
  api.get(`/epaper/date/${date}`).then(r => r.data);

// ── Admin: E-Paper ───────────────────────────────────────
export const adminFetchEpapers = () =>
  api.get('/epaper/admin/all').then(r => r.data);

export const adminCreateEpaper = (data) =>
  api.post('/epaper', data).then(r => r.data);

export const adminUpdateEpaper = (id, data) =>
  api.put(`/epaper/${id}`, data).then(r => r.data);

export const adminDeleteEpaper = (id) =>
  api.delete(`/epaper/${id}`).then(r => r.data);

// ── Public: Advertisements ───────────────────────────────
export const fetchAds = () =>
  api.get('/advertisements').then(r => r.data);

// ── Admin: Advertisements ────────────────────────────────
export const adminFetchAds = () =>
  api.get('/advertisements/admin/all').then(r => r.data);

export const adminCreateAd = (data) =>
  api.post('/advertisements', data).then(r => r.data);

export const adminUpdateAd = (id, data) =>
  api.put(`/advertisements/${id}`, data).then(r => r.data);

export const adminDeleteAd = (id) =>
  api.delete(`/advertisements/${id}`).then(r => r.data);
