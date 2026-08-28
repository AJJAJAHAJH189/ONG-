export type NeedCategory =
  | 'alimentacao'
  | 'saude_medicamentos'
  | 'transporte_acessivel'
  | 'cuidados_companhia'
  | 'apoio_juridico_social'
  | 'tecnologia_reparos';

export type SpecificNeed =
  | 'deficiencia_visual'
  | 'deficiencia_auditiva_libras'
  | 'mobilidade_reduzida'
  | 'idoso_apoio_digital'
  | 'neurodivergente_leitura_facil'
  | 'nenhuma';

export type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'urgente';

export type RequestStatus = 'pendente' | 'em_atendimento' | 'concluido';

export interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  category: NeedCategory;
  specificNeeds: SpecificNeed[];
  urgency: UrgencyLevel;
  description: string;
  status: RequestStatus;
  createdAt: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  statusNotes?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills: NeedCategory[];
  accessibilityExperience: string[];
  availability: 'manha' | 'tarde' | 'noite' | 'finais_de_semana' | 'integral';
  bio: string;
  createdAt: string;
  activeRequestsCount: number;
}

export type ContrastTheme = 'normal' | 'high-contrast' | 'dark' | 'sepia';
export type FontSizeScale = 'normal' | 'large' | 'extralarge';

export interface AccessibilityPreferences {
  contrastTheme: ContrastTheme;
  fontSize: FontSizeScale;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  screenReaderVoice: boolean;
}

export interface ApiErrorResponse {
  error: boolean;
  code: string;
  message: string;
  field?: string;
  details?: Record<string, string>;
}

export interface StarlinkSimulationConfig {
  enabled: boolean;
  latencyMs: number;
  jitterMs: number;
  packetLossRate: number; // percentage 0 - 100
  offlineMode: boolean;
}

export interface SystemStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalVolunteers: number;
  ruralZoneRequests: number;
}
