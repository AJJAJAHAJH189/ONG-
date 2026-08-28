import React, { useState, useEffect, useCallback } from 'react';
import { SkipLinks } from './components/SkipLinks';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { Header, ActiveTab } from './components/Header';
import { LiveAnnouncer } from './components/LiveAnnouncer';
import { HelpRequestForm } from './components/HelpRequestForm';
import { VolunteerForm } from './components/VolunteerForm';
import { HelpRequestsBoard } from './components/HelpRequestsBoard';
import { RequestDetailModal } from './components/RequestDetailModal';
import { StarlinkSimulator } from './components/StarlinkSimulator';
import { AuditAndPitchGuide } from './components/AuditAndPitchGuide';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Footer } from './components/Footer';
import {
  AccessibilityPreferences,
  HelpRequest,
  RequestStatus,
  SystemStats,
  Volunteer,
} from './types';
import { HeartHandshake, Users, Clock, CheckCircle2, ShieldAlert, Sparkles, Wifi } from 'lucide-react';

export default function App() {
  // Accessibility Preferences
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    contrastTheme: 'normal',
    fontSize: 'normal',
    dyslexiaFont: false,
    reducedMotion: false,
    screenReaderVoice: false,
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('solicitar');

  // Screen Reader Live Regions Messages
  const [politeMessage, setPoliteMessage] = useState<string>('');
  const [assertiveMessage, setAssertiveMessage] = useState<string>('');

  // Data State
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [openerElement, setOpenerElement] = useState<HTMLElement | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [shortcutsOpener, setShortcutsOpener] = useState<HTMLElement | null>(null);

  // Starlink & Rural Simulation State
  const [starlinkLatency, setStarlinkLatency] = useState<number>(50); // Default 50ms (Starlink realistic)
  const [starlinkOffline, setStarlinkOffline] = useState<boolean>(false);

  const announcePolite = useCallback((msg: string) => {
    setPoliteMessage(msg);
  }, []);

  const announceAssertive = useCallback((msg: string) => {
    setAssertiveMessage(msg);
  }, []);

  // Synchronize preferences with DOM classes
  useEffect(() => {
    const body = document.body;

    // Remove previous themes
    body.classList.remove('theme-high-contrast', 'theme-dark', 'theme-sepia');
    if (preferences.contrastTheme !== 'normal') {
      body.classList.add(`theme-${preferences.contrastTheme}`);
    }

    // Font Scaling
    const htmlEl = document.documentElement;
    if (preferences.fontSize === 'large') {
      htmlEl.style.fontSize = '118%';
    } else if (preferences.fontSize === 'extralarge') {
      htmlEl.style.fontSize = '135%';
    } else {
      htmlEl.style.fontSize = '100%';
    }

    // Dyslexia mode
    if (preferences.dyslexiaFont) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }, [preferences]);

  // Load initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [reqRes, volRes, statsRes] = await Promise.all([
        fetch('/api/help-requests'),
        fetch('/api/volunteers'),
        fetch('/api/stats'),
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data);
      }

      if (volRes.ok) {
        const data = await volRes.json();
        setVolunteers(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePreferences = (updated: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updated }));
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    const names: Record<ActiveTab, string> = {
      solicitar: 'Solicitar Ajuda Comunitária',
      chamados: 'Central de Chamados Comunitários',
      voluntarios: 'Quero Ser Voluntário',
      starlink: 'Simulador de Redes Rurais e Starlink',
      guia: 'Guia WCAG 2.2 e Roteiro da Banca',
    };
    announcePolite(`Página alterada para: ${names[tab]}`);

    // Set focus to the main container
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.focus();
    }
  };

  const handleNewRequestSuccess = (newReq: HelpRequest) => {
    setRequests(prev => [newReq, ...prev]);
    fetchData();
  };

  const handleNewVolunteerSuccess = (newVol: Volunteer) => {
    setVolunteers(prev => [newVol, ...prev]);
    fetchData();
  };

  const handleOpenDetailModal = (req: HelpRequest, opener: HTMLElement | null) => {
    setSelectedRequest(req);
    setOpenerElement(opener);
  };

  const handleCloseDetailModal = () => {
    setSelectedRequest(null);
  };

  const handleUpdateStatus = async (
    id: string,
    status: RequestStatus,
    volunteerId?: string,
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/help-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          assignedVolunteerId: volunteerId,
          statusNotes: notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests(prev =>
          prev.map(r => (r.id === id ? { ...r, ...data.request } : r))
        );
        announcePolite(`Status do chamado atualizado para ${status}.`);
        fetchData();
      }
    } catch (err) {
      announceAssertive('Erro ao atualizar chamado no servidor.');
    }
  };

  const handleOpenShortcuts = (opener?: HTMLElement) => {
    setShortcutsOpener(opener || null);
    setIsShortcutsOpen(true);
  };

  const handleSyncOfflineQueue = (syncedCount: number) => {
    fetchData();
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pendente').length;

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      {/* 1. Bypass Skip Links for Keyboard Users */}
      <SkipLinks />

      {/* 2. ARIA Live Regions for Screen Readers */}
      <LiveAnnouncer
        politeMessage={politeMessage}
        assertiveMessage={assertiveMessage}
      />

      {/* 3. Global Accessibility Toolbar */}
      <AccessibilityToolbar
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        announcePolite={announcePolite}
        onOpenShortcutsModal={() => handleOpenShortcuts()}
      />

      {/* 4. Semantic Banner Header & Nav */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingCount={pendingRequestsCount}
        ruralModeActive={starlinkLatency > 0 || starlinkOffline}
      />

      {/* 5. Main Content Landmark */}
      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none"
      >
        {/* Quick Accessible Stats Overview Banner */}
        <section
          aria-label="Resumo estatístico da rede solidária"
          className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold" aria-hidden="true">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block leading-tight">
                {stats ? stats.totalRequests : requests.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Chamados Totais</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold" aria-hidden="true">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-700 block leading-tight">
                {pendingRequestsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">Aguardando Voluntário</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 border border-green-200 flex items-center justify-center font-bold" aria-hidden="true">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-green-700 block leading-tight">
                {requests.filter(r => r.status === 'concluido').length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Atendimentos Concluídos</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center font-bold" aria-hidden="true">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block leading-tight">
                {stats ? stats.totalVolunteers : volunteers.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Voluntários Prontos</span>
            </div>
          </div>
        </section>

        {/* Tab 1: Solicitar Ajuda Form */}
        {activeTab === 'solicitar' && (
          <HelpRequestForm
            onSuccess={handleNewRequestSuccess}
            announcePolite={announcePolite}
            announceAssertive={announceAssertive}
            starlinkOffline={starlinkOffline}
            starlinkLatency={starlinkLatency}
          />
        )}

        {/* Tab 2: Central de Chamados */}
        {activeTab === 'chamados' && (
          <HelpRequestsBoard
            requests={requests}
            volunteers={volunteers}
            onOpenModal={handleOpenDetailModal}
            announcePolite={announcePolite}
          />
        )}

        {/* Tab 3: Quero Ser Voluntário */}
        {activeTab === 'voluntarios' && (
          <VolunteerForm
            onSuccess={handleNewVolunteerSuccess}
            announcePolite={announcePolite}
            announceAssertive={announceAssertive}
            starlinkLatency={starlinkLatency}
          />
        )}

        {/* Tab 4: Simulador Starlink */}
        {activeTab === 'starlink' && (
          <StarlinkSimulator
            latencyMs={starlinkLatency}
            onLatencyChange={setStarlinkLatency}
            offlineMode={starlinkOffline}
            onOfflineToggle={setStarlinkOffline}
            announcePolite={announcePolite}
            onSyncOfflineQueue={handleSyncOfflineQueue}
          />
        )}

        {/* Tab 5: Diretrizes WCAG 2.2 */}
        {activeTab === 'guia' && (
          <AuditAndPitchGuide announcePolite={announcePolite} />
        )}
      </main>

      {/* Detail Modal with Focus Trap and Esc Handling */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          volunteers={volunteers}
          onClose={handleCloseDetailModal}
          onUpdateStatus={handleUpdateStatus}
          announcePolite={announcePolite}
          openerElement={openerElement}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        announcePolite={announcePolite}
        openerElement={shortcutsOpener}
      />

      {/* 6. Semantic Footer */}
      <Footer onOpenShortcuts={() => handleOpenShortcuts()} />
    </div>
  );
}
