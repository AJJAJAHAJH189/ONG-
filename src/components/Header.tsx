import React from 'react';
import { HeartHandshake, Users, ClipboardList, Activity, BookOpen, Wifi } from 'lucide-react';

export type ActiveTab = 'solicitar' | 'chamados' | 'voluntarios' | 'starlink' | 'guia';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
  ruralModeActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  ruralModeActive,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'solicitar',
      label: 'Solicitar Ajuda',
      icon: <HeartHandshake className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'chamados',
      label: 'Central de Chamados',
      icon: <ClipboardList className="w-5 h-5" aria-hidden="true" />,
      badge: pendingCount,
    },
    {
      id: 'voluntarios',
      label: 'Quero Ser Voluntário',
      icon: <Users className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'starlink',
      label: 'Rede Rural & Starlink',
      icon: <Wifi className="w-5 h-5" aria-hidden="true" />,
    },
    {
      id: 'guia',
      label: 'Guia WCAG & Pitch',
      icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  return (
    <header role="banner" className="bg-slate-900 text-white border-b-4 border-blue-600 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo and Platform title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-xs" aria-hidden="true">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  ACESS-WEB <span className="text-blue-400 font-normal text-xs uppercase tracking-widest inline-block ml-1.5">Plataforma Acessível</span>
                </h1>
                <span className="bg-slate-800 text-blue-300 text-xs px-2 py-0.5 rounded font-semibold border border-slate-700">
                  ONG
                </span>
                {ruralModeActive && (
                  <span className="flex items-center gap-1 bg-amber-950 text-amber-300 text-xs px-2 py-0.5 rounded font-medium border border-amber-700/60">
                    <Wifi className="w-3 h-3 text-amber-400 animate-pulse" aria-hidden="true" />
                    <span>Starlink Ativa</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-normal">
                Conexão inclusiva entre voluntários e pessoas vulneráveis (Idosos, PCDs e Famílias)
              </p>
            </div>
          </div>

          {/* Emergency / Fast Assistance Callout */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-md px-3.5 py-2 text-xs text-slate-300">
            <Activity className="w-4 h-4 text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span>
              Ajuda emergencial: <strong className="text-white font-bold">Disque 100</strong> (Direitos Humanos) ou{' '}
              <strong className="text-white font-bold">192</strong> (SAMU)
            </span>
          </div>
        </div>

        {/* Semantic Navigation Menu */}
        <nav aria-label="Navegação Principal do Sistema" className="flex overflow-x-auto pb-1 -mb-px gap-1 sm:gap-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[46px] px-3.5 sm:px-4 py-2.5 rounded-t-md font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-slate-800 text-white font-bold'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                    aria-label={`${item.badge} chamados pendentes`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
