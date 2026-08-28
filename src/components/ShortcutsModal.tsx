import React, { useEffect, useRef } from 'react';
import { X, Keyboard, HelpCircle, Sparkles, Check } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcePolite: (msg: string) => void;
  openerElement: HTMLElement | null;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  announcePolite,
  openerElement,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      announcePolite('Guia de atalhos de teclado aberto.');
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    announcePolite('Guia de atalhos fechado.');
    if (openerElement) {
      openerElement.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        aria-describedby="shortcuts-desc"
        className="bg-white rounded-2xl border-2 border-stone-300 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center border border-stone-300 transition-colors"
          aria-label="Fechar guia de atalhos (Esc)"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
            <Keyboard className="w-6 h-6" />
          </span>
          <h2 id="shortcuts-title" className="text-xl sm:text-2xl font-black text-teal-950">
            Atalhos de Teclado & Navegação
          </h2>
        </div>

        <p id="shortcuts-desc" className="text-sm text-stone-600 mb-5">
          Esta aplicação foi projetada para ser <strong>100% operável via teclado</strong>, atendendo integralmente às diretrizes da WCAG 2.2 Nível AA.
        </p>

        <div className="space-y-3 text-xs sm:text-sm">
          {[
            { key: 'Tab', desc: 'Avança para o próximo elemento interativo (botão, link, campo).' },
            { key: 'Shift + Tab', desc: 'Retorna para o elemento interativo anterior.' },
            { key: 'Enter / Espaço', desc: 'Ativa botões, abre links e seleciona caixas de verificação.' },
            { key: 'Esc (Escape)', desc: 'Fecha imediatamente qualquer janela modal ou menu aberto.' },
            { key: 'Alt + 1', desc: 'Pula diretamente para o conteúdo principal da página.' },
            { key: 'Alt + 2', desc: 'Foca na barra de ferramentas de acessibilidade superior.' },
            { key: 'Alt + 3', desc: 'Acessa o formulário de solicitação de ajuda.' },
            { key: 'Alt + 4', desc: 'Navega para a central de chamados comunitários.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200"
            >
              <kbd className="px-2.5 py-1 bg-stone-200 text-stone-900 font-mono font-bold rounded text-xs border border-stone-300 shadow-2xs">
                {item.key}
              </kbd>
              <span className="text-stone-700 text-right flex-1 font-medium">{item.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
