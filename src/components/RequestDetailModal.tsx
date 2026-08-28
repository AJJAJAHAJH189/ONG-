import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { HelpRequest, RequestStatus, Volunteer } from '../types';
import { speakText, isSpeechSupported } from '../utils/speech';

interface RequestDetailModalProps {
  request: HelpRequest | null;
  volunteers: Volunteer[];
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: RequestStatus,
    volunteerId?: string,
    notes?: string
  ) => Promise<void>;
  announcePolite: (msg: string) => void;
  openerElement: HTMLElement | null;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  volunteers,
  onClose,
  onUpdateStatus,
  announcePolite,
  openerElement,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>('pendente');
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
      setSelectedVolunteer(request.assignedVolunteerId || '');
      setNotes(request.statusNotes || '');

      // Announce dialog opened to screen readers
      announcePolite(`Detalhes do chamado de ${request.name} abertos em janela de diálogo.`);

      // Focus close button initially
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [request]);

  // Focus trap and ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    onClose();
    announcePolite('Janela de detalhes fechada.');
    if (openerElement) {
      openerElement.focus();
    }
  };

  const handleSave = async () => {
    if (!request) return;
    setIsSaving(true);
    await onUpdateStatus(request.id, selectedStatus, selectedVolunteer || undefined, notes);
    setIsSaving(false);
    handleClose();
  };

  const handleReadDetails = () => {
    if (!request) return;
    const text = `Chamado de ${request.name}. Categoria: ${request.category.replace('_', ' ')}. Urgência: ${request.urgency}. Município: ${request.city}. Endereço: ${request.address}. Telefone: ${request.phone}. Descrição: ${request.description}. Status atual: ${request.status}.`;
    speakText(text, {
      onStart: () => announcePolite('Lendo detalhes do chamado em voz sintetizada.'),
    });
  };

  if (!request) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        className="bg-white rounded-2xl border-2 border-stone-300 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button with high touch target & focus */}
        <button
          ref={closeButtonRef}
          type="button"
          id="btn-close-modal"
          onClick={handleClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center border border-stone-300 transition-colors"
          aria-label="Fechar janela de detalhes do chamado (Esc)"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 mb-2 pr-12">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              request.urgency === 'urgente'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : request.urgency === 'alta'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Urgência: {request.urgency}</span>
          </span>

          <span className="text-xs font-semibold text-stone-600">
            ID: {request.id}
          </span>
        </div>

        <h2 id="modal-title" className="text-2xl font-black text-teal-950 mb-2">
          {request.name}
        </h2>

        {isSpeechSupported() && (
          <button
            type="button"
            onClick={handleReadDetails}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md border border-teal-200"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>Ouvir Detalhes em Áudio</span>
          </button>
        )}

        <div id="modal-desc" className="space-y-4 text-stone-800 text-sm sm:text-base border-t border-stone-200 pt-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Necessidade Relatada:
            </h3>
            <p className="text-stone-900 font-medium whitespace-pre-wrap">{request.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Phone className="w-4 h-4 text-teal-700 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-xs text-stone-600 block">Contato:</span>
                <strong className="text-stone-900">{request.phone}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <MapPin className="w-4 h-4 text-teal-700 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-xs text-stone-600 block">Localidade:</span>
                <strong className="text-stone-900">{request.city} - {request.state}</strong>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs sm:text-sm">
            <span className="text-xs text-stone-600 block font-bold">Endereço Completo:</span>
            <span className="text-stone-900">{request.address}</span>
          </div>

          {request.specificNeeds && request.specificNeeds.length > 0 && (
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1">
                Acessibilidades Solicitadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {request.specificNeeds.map((need, idx) => (
                  <span
                    key={idx}
                    className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded-md"
                  >
                    {need.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status and Assignment Form */}
          <div className="border-t border-stone-200 pt-4 mt-6">
            <h3 className="font-bold text-base text-teal-950 mb-3">
              Gestão do Atendimento Comunitário
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-status-select" className="block text-xs font-bold text-stone-900 mb-1">
                  Status do Chamado:
                </label>
                <select
                  id="modal-status-select"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as RequestStatus)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-stone-400 bg-white font-medium text-stone-900"
                >
                  <option value="pendente">⏳ Pendente (Aguardando Voluntário)</option>
                  <option value="em_atendimento">🔄 Em Atendimento (Em andamento)</option>
                  <option value="concluido">✅ Concluído (Ajuda entregue)</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-vol-select" className="block text-xs font-bold text-stone-900 mb-1">
                  Voluntário Responsável:
                </label>
                <select
                  id="modal-vol-select"
                  value={selectedVolunteer}
                  onChange={e => setSelectedVolunteer(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-stone-400 bg-white font-medium text-stone-900"
                >
                  <option value="">-- Nenhum / Em Aberto --</option>
                  {volunteers.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="modal-notes" className="block text-xs font-bold text-stone-900 mb-1">
                Anotações de Progresso do Atendimento:
              </label>
              <textarea
                id="modal-notes"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Voluntário entrou em contato via WhatsApp e agendou entrega para sábado às 14h..."
                className="w-full p-2.5 rounded-lg border border-stone-400 bg-white text-xs sm:text-sm text-stone-900"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[44px] px-5 py-2 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-sm shadow-md flex items-center gap-2"
          >
            {isSaving ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Salvar Atualizações</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
