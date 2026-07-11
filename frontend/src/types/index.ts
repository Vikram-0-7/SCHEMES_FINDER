export interface Scheme {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  state: string | null;
  eligibility: string | null;
  benefits: string | null;
  documents_required: string | null;
  application_url: string | null;
  source: string | null;
  application_process: string | null;
  scheme_type: string | null;
  tags: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface SchemeListResponse {
  schemes: Scheme[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  scheme_count: number;
}

export interface DiscoverRequest {
  profiles: string[];
  category?: string;
  state?: string;
  keyword?: string;
}

export interface DiscoverResponse {
  schemes: Scheme[];
  state_count: number;
  central_count: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// ─── Widget / AI Copilot types ────────────────────────────────────────────
export interface WidgetAction {
  type: 'navigate' | 'filter' | 'search' | 'open_discover' | 'none';
  payload?: string | null;
}

export interface WidgetMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  action?: WidgetAction;
  detectedLanguage?: string;
}
