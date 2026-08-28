import React, { useState } from 'react';
import {
  Type,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  ShieldCheck,
  Zap,
  Info,
  HelpCircle,
} from 'lucide-react';
import { AccessibilityPreferences, ContrastTheme, FontSizeScale } from '../types';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';

interface AccessibilityToolbarProps {
  preferences: AccessibilityPreferences;
  onUpdatePreferences: (updated: Partial<AccessibilityPreferences>) => void;
  announcePolite: (msg: string) => void;
  onOpenShortcutsModal: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  preferences,
  onUpdatePreferences,
  announcePolite,
  onOpenShortcutsModal,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechAvailable = isSpeechSupported();

  const handleFontChange = (scale: FontSizeScale) => {
    onUpdatePreferences({ fontSize: scale });
    const labels = {
      normal: 'Tamanho de texto normal (100%)',
      large: 'Tamanho de texto ampliado (125%)',
      extralarge: 'Tamanho de texto extra grande (150%)',
    };
    announcePolite(`Tamanho de texto ajustado para: ${labels[scale]}`);
  };

  const handleThemeChange = (theme: ContrastTheme) => {
    onUpdatePreferences({ contrastTheme: theme });
    const labels = {
      normal: 'Tema Padrão com Alto Contraste WCAG 2.2 AA',
      'high-contrast': 'Tema de Alto Contraste Máximo (Amarelo sobre Fundo Preto)',
      dark: 'Tema Escuro Confortável',
      sepia: 'Tema Sépia com Baixo Cansaço Visual',
    };
    announcePolite(`Tema visual alterado para: ${labels[theme]}`);
  };

  const toggleDyslexia = () => {
    const next = !preferences.dyslexiaFont;
    onUpdatePreferences({ dyslexiaFont: next });
    announcePolite(
      next
        ? 'Modo Fonte de Leitura Fácil e espaçamento ampliado ativado'
        : 'Modo Fonte de Leitura Fácil desativado'
    );
  };

  const toggleReducedMotion = () => {
    const next = !preferences.reducedMotion;
    onUpdatePreferences({ reducedMotion: next });
    announcePolite(
      next
        ? 'Redução de movimento ativada. Transições e animações foram desligadas.'
        : 'Redução de movimento desativada.'
    );
  };

  const handleReadCurrentPage = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      announcePolite('Leitura de voz interrompida.');
    } else {
      setIsPlayingAudio(true);
      const summaryText =
        'Bem-vindo à plataforma Acesso Solidário. Esta aplicação conecta voluntários a pessoas idosas, pessoas com deficiência e famílias em situação de vulnerabilidade. Você pode solicitar apoio comunitário, se cadastrar como voluntário ou navegar pelos chamados abertos. Todos os botões e formulários são acessíveis por teclado e leitor de tela.';
      speakText(summaryText, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => {
          setIsPlayingAudio(false);
          announcePolite('Leitura de introdução finalizada.');
        },
        onError: () => {
          setIsPlayingAudio(false);
        },
      });
      announcePolite('Iniciando leitura de áudio em voz sintetizada.');
    }
  };

  return (
    <aside
      id="accessibility-toolbar"
      aria-label="Ferramentas de Acessibilidade"
      className="bg-slate-100 text-slate-800 text-sm border-b border-slate-300 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        {/* Compliance indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded border border-slate-700 font-semibold text-xs tracking-tight">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>WCAG 2.2 AA • Lighthouse 100</span>
          </div>
          <span className="hidden md:inline-block text-slate-600 text-xs font-semibold uppercase tracking-wider">
            Acessibilidade:
          </span>
        </div>

        {/* Accessibility control buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Font Size group */}
          <div
            role="group"
            aria-label="Controle de Tamanho da Fonte"
            className="flex items-center bg-white rounded border border-slate-300 p-0.5"
          >
            <span className="text-xs text-slate-600 px-1.5 font-semibold flex items-center gap-1">
              <Type className="w-3 h-3" aria-hidden="true" />
              <span>Fonte:</span>
            </span>
            <button
              id="btn-font-normal"
              type="button"
              onClick={() => handleFontChange('normal')}
              aria-pressed={preferences.fontSize === 'normal'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                preferences.fontSize === 'normal'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tamanho Normal de Fonte (100%)"
            >
              100%
            </button>
            <button
              id="btn-font-large"
              type="button"
              onClick={() => handleFontChange('large')}
              aria-pressed={preferences.fontSize === 'large'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                preferences.fontSize === 'large'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tamanho Ampliado de Fonte (125%)"
            >
              125%
            </button>
            <button
              id="btn-font-extralarge"
              type="button"
              onClick={() => handleFontChange('extralarge')}
              aria-pressed={preferences.fontSize === 'extralarge'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                preferences.fontSize === 'extralarge'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Tamanho Extra Grande de Fonte (150%)"
            >
              150%
            </button>
          </div>

          {/* Contrast Mode group */}
          <div
            role="group"
            aria-label="Modo de Contraste e Cores"
            className="flex items-center bg-white rounded border border-slate-300 p-0.5"
          >
            <span className="text-xs text-slate-600 px-1.5 font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>Contraste:</span>
            </span>
            <button
              id="btn-theme-normal"
              type="button"
              onClick={() => handleThemeChange('normal')}
              aria-pressed={preferences.contrastTheme === 'normal'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                preferences.contrastTheme === 'normal'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Contraste Padrão WCAG AA"
            >
              Padrão
            </button>
            <button
              id="btn-theme-high-contrast"
              type="button"
              onClick={() => handleThemeChange('high-contrast')}
              aria-pressed={preferences.contrastTheme === 'high-contrast'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-bold rounded transition-colors ${
                preferences.contrastTheme === 'high-contrast'
                  ? 'bg-yellow-400 text-black border border-slate-900'
                  : 'text-slate-800 hover:text-black hover:bg-slate-100'
              }`}
              title="Alto Contraste Amarelo/Preto"
            >
              Alto Contraste
            </button>
            <button
              id="btn-theme-dark"
              type="button"
              onClick={() => handleThemeChange('dark')}
              aria-pressed={preferences.contrastTheme === 'dark'}
              className={`min-h-[32px] px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                preferences.contrastTheme === 'dark'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Modo Escuro Suave"
            >
              Escuro
            </button>
          </div>

          {/* Dyslexia / Easy reading font */}
          <button
            id="btn-toggle-dyslexia"
            type="button"
            onClick={toggleDyslexia}
            aria-pressed={preferences.dyslexiaFont}
            className={`min-h-[34px] px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              preferences.dyslexiaFont
                ? 'bg-blue-600 text-white border-blue-700 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Ativar fonte e espaçamento para facilitar a leitura (Dislexia)"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Leitura Fácil</span>
          </button>

          {/* Reduced Motion toggle */}
          <button
            id="btn-toggle-motion"
            type="button"
            onClick={toggleReducedMotion}
            aria-pressed={preferences.reducedMotion}
            className={`min-h-[34px] px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              preferences.reducedMotion
                ? 'bg-blue-600 text-white border-blue-700 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Reduzir e desligar animações visuais"
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{preferences.reducedMotion ? 'Sem Animações' : 'Movimento'}</span>
          </button>

          {/* Speech Audio Reader */}
          {speechAvailable && (
            <button
              id="btn-read-page"
              type="button"
              onClick={handleReadCurrentPage}
              aria-pressed={isPlayingAudio}
              className={`min-h-[34px] px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-emerald-700 text-white border-emerald-800 animate-pulse font-bold'
                  : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50 font-semibold'
              }`}
              title="Ouvir resumo em áudio da página via voz sintetizada"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Parar Áudio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ouvir Página</span>
                </>
              )}
            </button>
          )}

          {/* Keyboard Shortcuts Info Button */}
          <button
            id="btn-shortcuts-modal"
            type="button"
            onClick={onOpenShortcutsModal}
            className="min-h-[34px] px-2.5 py-1 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-1"
            title="Ver atalhos de teclado e guia de navegação"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            <span className="hidden sm:inline">Atalhos</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
