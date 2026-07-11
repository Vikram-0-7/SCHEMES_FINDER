import axios from 'axios';
import type { SchemeListResponse, Category, DiscoverRequest, DiscoverResponse, Scheme } from '../types';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Schemes API
export const getSchemes = async (params: {
  page?: number;
  per_page?: number;
  category?: string;
  state?: string;
  search?: string;
  scheme_type?: string;
}): Promise<SchemeListResponse> => {
  const { data } = await api.get('/schemes', { params });
  return data;
};

export const getScheme = async (id: number): Promise<Scheme> => {
  const { data } = await api.get(`/schemes/${id}`);
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/schemes/categories');
  return data;
};

export const getStates = async (): Promise<string[]> => {
  const { data } = await api.get('/schemes/states');
  return data;
};

export const searchSchemes = async (query: string): Promise<Scheme[]> => {
  const { data } = await api.get('/schemes/search', { params: { q: query } });
  return data;
};

// Discover API
export const discoverSchemes = async (request: DiscoverRequest): Promise<DiscoverResponse> => {
  const { data } = await api.post('/discover', request);
  return data;
};

export const liveSearchSchemes = async (query: string): Promise<Scheme[]> => {
  const { data } = await api.post('/discover/live-search', { query });
  return data;
};

// Chat API
export const sendChatMessage = async (message: string): Promise<string> => {
  const { data } = await api.post('/chat', { message });
  return data.reply;
};

// Widget Copilot API
export interface WidgetAction {
  type: 'navigate' | 'filter' | 'search' | 'open_discover' | 'none';
  payload: string | null;
}

export interface WidgetChatResponse {
  reply: string;
  action: WidgetAction | null;
  detected_language: string;
}

export const sendWidgetMessage = async (
  message: string,
  pageContext?: string,
  schemeContext?: string,
  conversationHistory?: { role: string; content: string }[],
): Promise<WidgetChatResponse> => {
  const { data } = await api.post('/chat/widget', {
    message,
    page_context: pageContext || null,
    scheme_context: schemeContext || null,
    conversation_history: conversationHistory || [],
  });
  return data;
};

export default api;
