import React from 'react';
import { HeartHandshake, ShieldCheck, Phone, HelpCircle, Heart, Wifi } from 'lucide-react';

interface FooterProps {
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShortcuts }) => {
  return (
    <footer
      role="contentinfo"
      aria-label="Rodapé Institucional e Canais de Emergência"
      className="bg-slate-900 text-slate-400 text-sm mt-16 border-t-4 border-blue-600 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About NGO */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                A
              </div>
              <span className="font-bold text-lg text-white">ACESS-WEB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma comunitária de alto impacto social, criada para conectar voluntários a pessoas idosas, com deficiência e famílias vulneráveis, com suporte nativo a redes rurais e tecnologias assistivas.
            </p>
          </div>

          {/* Column 2: Emergency contacts */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Canais Públicos de Apoio
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                <span>
                  <strong className="text-white">Disque 100:</strong> Direitos Humanos e PCDs
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                <span>
                  <strong className="text-white">192:</strong> SAMU (Emergência Médica)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>
                  <strong className="text-white">188:</strong> CVV (Apoio Emocional)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility & Technology */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Padrões & Conformidade
            </h3>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5 text-blue-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span>WCAG 2.2 Nível AA Integral</span>
              </p>
              <p>• Meta Lighthouse Acessibilidade: 100</p>
              <p>• Meta axe DevTools: 0 erros</p>
              <p>• 100% Operável por Teclado e NVDA</p>
              <p className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-amber-400" aria-hidden="true" />
                <span>Suporte a Starlink (40–80ms)</span>
              </p>
            </div>
          </div>

          {/* Column 4: Quick Accessibility Actions */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Acessibilidade Rápida
            </h3>
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="w-full min-h-[44px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>Ver Guia de Atalhos de Teclado</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              Pressione <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-white border border-slate-700">Alt + 1</kbd> para voltar ao topo.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ACESS-WEB — Desenvolvido sob as Normas e Diretrizes de Acessibilidade (eMAG / WCAG 2.2).</p>
          <p className="flex items-center gap-1">
            <span>Inclusão Universal e Acessibilidade Digital</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
};
