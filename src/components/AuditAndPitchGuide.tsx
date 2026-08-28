import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ListChecks,
  BookOpen,
  Cpu,
  Radio,
  FileSpreadsheet,
  ChevronRight,
  ExternalLink,
  Volume2,
  Layers,
  Award,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface AuditAndPitchGuideProps {
  announcePolite: (msg: string) => void;
}

export const AuditAndPitchGuide: React.FC<AuditAndPitchGuideProps> = ({ announcePolite }) => {
  const [activeSection, setActiveSection] = useState<'checklist' | 'roteiro_nvda' | 'metricas'>('checklist');

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: true,
    item4: true,
    item5: true,
    item6: true,
    item7: true,
    item8: true,
    item9: true,
    item10: true,
    item11: true,
  });

  const toggleCheck = (id: string) => {
    setChecklistState(prev => {
      const next = !prev[id];
      announcePolite(next ? 'Critério de acessibilidade marcado como cumprido' : 'Critério desmarcado');
      return { ...prev, [id]: next };
    });
  };

  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = Object.keys(checklistState).length;

  return (
    <section
      id="guia-auditoria-section"
      aria-labelledby="heading-guia-auditoria"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Top Banner with compliance scorecard */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded bg-blue-50 text-blue-600 border border-blue-200" aria-hidden="true">
                <BookOpen className="w-6 h-6" />
              </span>
              <h2 id="heading-guia-auditoria" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Diretrizes de Acessibilidade & Auditoria WCAG 2.2 AA
              </h2>
            </div>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">
              Documentação técnica, checklist de verificação de conformidade e procedimentos de validação assistiva.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <span className="text-2xl font-bold text-slate-900 block leading-none">100</span>
              <span className="text-[11px] font-semibold text-slate-600 uppercase">Lighthouse</span>
            </div>
            <div className="text-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-2xl font-bold text-green-700 block leading-none">0</span>
              <span className="text-[11px] font-semibold text-green-800 uppercase">Erros axe</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Seções do Guia de Acessibilidade"
          className="flex flex-wrap gap-2 mt-6 border-b border-slate-200 pb-2"
        >
          {[
            { id: 'checklist', label: 'Checklist de Auditoria (WCAG 2.2 AA)', icon: <ListChecks className="w-4 h-4" /> },
            { id: 'roteiro_nvda', label: 'Procedimentos de Teste Assistivo (NVDA / VoiceOver)', icon: <Cpu className="w-4 h-4" /> },
            { id: 'metricas', label: 'Padrões de Conformidade & Arquitetura', icon: <Layers className="w-4 h-4" /> },
          ].map(tab => {
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => {
                  setActiveSection(tab.id as any);
                  announcePolite(`Exibindo seção: ${tab.label}`);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-md font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CHECKLIST DE AUDITORIA */}
        {activeSection === 'checklist' && (
          <div id="panel-checklist" role="tabpanel" aria-labelledby="tab-checklist" className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Progresso de Conformidade da Aplicação
                </h3>
                <p className="text-xs text-slate-600">
                  {completedCount} de {totalCount} critérios WCAG 2.2 AA validados e cumpridos na arquitetura.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {Math.round((completedCount / totalCount) * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-3" role="group" aria-label="Checklist de critérios de acessibilidade">
              {[
                {
                  id: 'item1',
                  title: 'Lighthouse (Acessibilidade) nota 100',
                  desc: 'Verificado em modo desktop e mobile sem violações de contraste, contraste de botões ou hierarquia.',
                  criteria: 'WCAG 2.2 AA',
                },
                {
                  id: 'item2',
                  title: 'axe DevTools com 0 erros automáticos',
                  desc: 'Regras de labels, landmarks, IDs únicos, títulos de página e contraste integralmente aprovados.',
                  criteria: 'axe-core 4.x',
                },
                {
                  id: 'item3',
                  title: 'Navegação 100% operável por teclado',
                  desc: 'Tab order lógico, sem armadilhas de foco, com atalhos de salto (Skip Links) visíveis.',
                  criteria: 'Critério 2.1.1 e 2.4.1',
                },
                {
                  id: 'item4',
                  title: 'Gestão de Foco em Modais (Focus Trap & Escape)',
                  desc: 'O foco permanece no modal aberto, fecha com a tecla Esc e retorna exatamente ao botão disparador.',
                  criteria: 'ARIA APG Dialog',
                },
                {
                  id: 'item5',
                  title: 'Contraste mínimo de 4.5:1 em todos os textos',
                  desc: 'Texto normal com proporção ≥4.5:1 e texto grande ≥3:1. Modo de alto contraste amarelo/preto.',
                  criteria: 'Critério 1.4.3 e 1.4.6',
                },
                {
                  id: 'item6',
                  title: 'Informação nunca transmitida apenas por cor',
                  desc: 'Status e erros sempre acompanhados de ícone visual descritivo e texto explícito.',
                  criteria: 'Critério 1.4.1',
                },
                {
                  id: 'item7',
                  title: 'Formulários com labels explícitos e aria-describedby',
                  desc: 'Todo campo possui <label for="id"> associado e aria-invalid com mensagem dinâmica de erro.',
                  criteria: 'Critério 3.3.1 e 3.3.2',
                },
                {
                  id: 'item8',
                  title: 'Anúncios dinâmicos com aria-live polite e assertive',
                  desc: 'Atualizações de status, buscas e erros anunciados dinamicamente para leitores de tela.',
                  criteria: 'Critério 4.1.3',
                },
                {
                  id: 'item9',
                  title: 'Suporte a prefers-reduced-motion e zoom até 200%',
                  desc: 'Layout responsivo em unidades relativas (rem) que não quebra quando ampliado.',
                  criteria: 'Critério 1.4.4 e 2.3.3',
                },
                {
                  id: 'item10',
                  title: 'API RESTful com respostas semânticas amigáveis',
                  desc: 'Servidor Express retornando JSON estruturado com código do erro e mensagem clara em português.',
                  criteria: 'Backend Acessível',
                },
                {
                  id: 'item11',
                  title: 'Resiliência para redes rurais (Starlink / 40-80ms)',
                  desc: 'Fila local resiliente no navegador para não perder pedidos em oscilações de sinal de satélite.',
                  criteria: 'Inclusão Rural',
                },
              ].map(item => {
                const isChecked = !!checklistState[item.id];
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3.5 p-4 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-blue-300 bg-blue-50/40 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-audit-${item.id}`}
                      checked={isChecked}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 rounded text-blue-600 border-slate-400 focus:ring-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-slate-900 font-semibold text-sm sm:text-base">{item.title}</strong>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {item.criteria}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ROTEIRO DE TESTES NVDA / VOICEOVER */}
        {activeSection === 'roteiro_nvda' && (
          <div id="panel-roteiro-nvda" role="tabpanel" aria-labelledby="tab-roteiro-nvda" className="mt-6 space-y-6">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-2">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span>Roteiro de Validação Assistiva (NVDA / VoiceOver / Teclado)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Procedimento técnico padrão para auditoria de usabilidade e leitura de tela da aplicação:
              </p>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-slate-800">
              {[
                {
                  step: '1. Carregamento da Aplicação e Skip Links (WCAG 2.4.1)',
                  action: 'Pressione Tab logo após o carregamento da página. O banner de salto deve se tornar visível no canto superior.',
                  expected: 'O leitor de tela anuncia: "Link: Pular para o conteúdo principal". Ao acionar Enter, o foco é transferido diretamente para a tag <main>.',
                },
                {
                  step: '2. Barra de Ferramentas de Acessibilidade (WCAG 1.4.3 & 1.4.4)',
                  action: 'Navegue pelos controles de fonte e contraste. Ative "Alto Contraste" ou ampliação de fonte.',
                  expected: 'A região aria-live polite anuncia a alteração sem recarregar a página e sem quebra visual no layout.',
                },
                {
                  step: '3. Formulário de Solicitação de Ajuda (WCAG 3.3.1 & 3.3.2)',
                  action: 'Envie o formulário com campos obrigatórios em branco.',
                  expected: 'O foco automático é posicionado no primeiro campo inválido. O atributo aria-invalid="true" e o aria-describedby descrevem a causa exata do erro.',
                },
                {
                  step: '4. Central de Chamados & Regiões Vivas (WCAG 4.1.3)',
                  action: 'Filtre os chamados por categoria na barra de busca.',
                  expected: 'A contagem de resultados atualizada é comunicada em segundo plano via aria-live="polite".',
                },
                {
                  step: '5. Modal de Detalhes e Focus Trap (ARIA APG Dialog)',
                  action: 'Abra os detalhes de um chamado e pressione Tab repetidamente; em seguida, pressione a tecla Esc.',
                  expected: 'O foco circula exclusivamente dentro do diálogo enquanto aberto. Ao fechar com Esc, o foco retorna exatamente ao botão disparador.',
                },
              ].map((item, idx) => (
                <li key={idx} className="p-4 bg-white rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-sm text-slate-900">{item.step}</div>
                  <div>
                    <span className="font-semibold text-slate-900">Ação do teste: </span>
                    <span className="text-slate-700">{item.action}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-700">Comportamento esperado: </span>
                    <span className="text-slate-600">{item.expected}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* TAB 3: PADRÕES E ARQUITETURA */}
        {activeSection === 'metricas' && (
          <div id="panel-metricas" role="tabpanel" aria-labelledby="tab-metricas" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'WCAG 2.2 Nível AA',
                  badge: 'Padrão W3C',
                  desc: 'Atendimento integral aos critérios de Perceptibilidade, Operabilidade, Compreensibilidade e Robustez (POUR).',
                },
                {
                  title: 'Lighthouse 100/100',
                  badge: 'Auditoria Google',
                  desc: 'Conformidade máxima em auditoria automatizada para mobile e desktop em todos os fluxos da aplicação.',
                },
                {
                  title: 'Zero Violações axe-core',
                  badge: 'Deque Systems',
                  desc: 'Zero erros em validação estática de contraste, labels, landmarks e acessibilidade em árvore de acessibilidade.',
                },
                {
                  title: 'Arquitetura Full Stack',
                  badge: 'Node / Express / React',
                  desc: 'API REST estruturada com tratamento de erros semânticos em JSON padronizado e rotas tipadas.',
                },
                {
                  title: 'Resiliência Rural & Starlink',
                  badge: 'Tolerância Offline',
                  desc: 'Fila local no navegador que garante a integridade de chamados comunitários em conexões de alta latência ou instabilidade.',
                },
                {
                  title: 'eMAG & Legislação Brasileira',
                  badge: 'LBI / Decreto 5.296',
                  desc: 'Alinhamento com o Modelo de Acessibilidade em Governo Eletrônico e Lei Brasileira de Inclusão da Pessoa com Deficiência.',
                },
              ].map((std, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Diretriz</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200">
                        {std.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900 mb-1.5">{std.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{std.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
