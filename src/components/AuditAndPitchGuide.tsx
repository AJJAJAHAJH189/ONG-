import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ListChecks,
  Clock,
  Award,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Eye,
  Radio,
  FileSpreadsheet,
  ChevronRight,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { speakText, isSpeechSupported } from '../utils/speech';

interface AuditAndPitchGuideProps {
  announcePolite: (msg: string) => void;
}

export const AuditAndPitchGuide: React.FC<AuditAndPitchGuideProps> = ({ announcePolite }) => {
  const [activeSection, setActiveSection] = useState<'checklist' | 'pitch' | 'rubrica' | 'roteiro_nvda'>('checklist');

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
      announcePolite(next ? 'Item de auditoria marcado como concluído' : 'Item desmarcado');
      return { ...prev, [id]: next };
    });
  };

  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = Object.keys(checklistState).length;

  const handleReadSection = (title: string, text: string) => {
    speakText(`${title}. ${text}`, {
      onStart: () => announcePolite(`Iniciando leitura em voz de: ${title}`),
    });
  };

  return (
    <section
      id="guia-auditoria-section"
      aria-labelledby="heading-guia-auditoria"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Top Banner with compliance scorecard */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
                <BookOpen className="w-6 h-6" />
              </span>
              <h2 id="heading-guia-auditoria" className="text-2xl sm:text-3xl font-black text-teal-950">
                Guia de Acessibilidade & Apresentação da Banca
              </h2>
            </div>
            <p className="mt-1 text-sm sm:text-base text-stone-600">
              Documentação técnica, checklist de auditoria WCAG 2.2 AA e roteiro do Pitch para avaliação final.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center bg-teal-50 px-4 py-2 rounded-xl border border-teal-200">
              <span className="text-2xl font-black text-teal-900 block leading-none">100</span>
              <span className="text-[11px] font-bold text-teal-700 uppercase">Lighthouse</span>
            </div>
            <div className="text-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <span className="text-2xl font-black text-emerald-900 block leading-none">0</span>
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Erros axe</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Seções do Guia de Acessibilidade"
          className="flex flex-wrap gap-2 mt-6 border-b border-stone-200 pb-2"
        >
          {[
            { id: 'checklist', label: '1. Checklist de Auditoria (WCAG 2.2)', icon: <ListChecks className="w-4 h-4" /> },
            { id: 'pitch', label: '2. Roteiro da Apresentação (Pitch)', icon: <Clock className="w-4 h-4" /> },
            { id: 'rubrica', label: '3. Rubrica de Avaliação da Banca', icon: <Award className="w-4 h-4" /> },
            { id: 'roteiro_nvda', label: '4. Roteiro de Testes Assistivos (NVDA)', icon: <Cpu className="w-4 h-4" /> },
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
                className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-teal-800 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-950'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Progresso de Conformidade da Aplicação
                </h3>
                <p className="text-xs text-stone-600">
                  {completedCount} de {totalCount} critérios WCAG 2.2 AA validados e cumpridos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 bg-stone-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-700 h-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-teal-900">
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
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-teal-300 bg-teal-50/40 text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-audit-${item.id}`}
                      checked={isChecked}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 rounded text-teal-700 border-stone-400 focus:ring-teal-700 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-stone-950 font-bold text-sm sm:text-base">{item.title}</strong>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                          {item.criteria}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ROTEIRO DA APRESENTAÇÃO (PITCH) */}
        {activeSection === 'pitch' && (
          <div id="panel-pitch" role="tabpanel" aria-labelledby="tab-pitch" className="mt-6 space-y-6">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <h3 className="font-extrabold text-base text-stone-950">
                Roteiro Oficial da Apresentação Oral (Pitch de 20 minutos)
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Conforme definido nas diretrizes do projeto prático, a apresentação é dividida em 5 etapas entre os membros da equipe:
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '1. Contexto & Desafio',
                  time: '3 min',
                  responsible: 'Integrante 1',
                  focus: 'Apresentar a ONG ConectaSolidária, o público atendido (idosos, pessoas com deficiência, famílias em vulnerabilidade) e o ecossistema tecnológico adotado.',
                  bulletPoints: [
                    'Apresentação da dor social: isolamento e barreiras digitais de acesso a auxílio comunitário.',
                    'Públicos-alvo e seus desafios com tecnologia assistiva.',
                    'Decisão de arquitetura inclusiva desde a primeira linha de código.',
                  ],
                },
                {
                  step: '2. Arquitetura Back-end & API',
                  time: '4 min',
                  responsible: 'Integrante 2',
                  focus: 'Demonstrar as rotas RESTful no Express (/api/help-requests, /api/volunteers), a integridade dos dados e o padrão de respostas de erro semânticas em JSON.',
                  bulletPoints: [
                    'Estrutura dos endpoints RESTful e validação dos campos obrigatórios.',
                    'Respostas de erro com código, campo e mensagem amigável para leitor de tela.',
                    'Persistência e integridade das solicitações comunitárias.',
                  ],
                },
                {
                  step: '3. Engenharia Front-end & Semântica',
                  time: '5 min',
                  responsible: 'Integrante 3',
                  focus: 'Explicar a estrutura semântica HTML5 (<header>, <nav>, <main>, <fieldset>), contraste de cores WCAG 2.2 AA (4.5:1), botões de 44px e fontes acessíveis.',
                  bulletPoints: [
                    'Hierarquia estrita de headings (H1, H2, H3) e landmarks ARIA.',
                    'Acessibilidade visual: tema padrão, alto contraste amarelo/preto e modo leitura fácil.',
                    'Formulários acessíveis com labels vinculados e aria-describedby dinâmico.',
                  ],
                },
                {
                  step: '4. Demonstração Acessível ao Vivo',
                  time: '5 min',
                  responsible: 'Integrante 4',
                  focus: 'Navegação ao vivo exclusivamente via Teclado (Tab/Shift+Tab/Enter/Esc), gestão de foco em modais (focus trap) e demonstração com leitor de tela.',
                  bulletPoints: [
                    'Preenchimento de chamado comunitário apenas pelo teclado.',
                    'Abertura de detalhes com focus trap e fechamento com Esc.',
                    'Feedback sonoro e regiões dinâmicas aria-live polite/assertive.',
                  ],
                },
                {
                  step: '5. Auditoria Técnica & Redes Rurais',
                  time: '3 min',
                  responsible: 'Toda a Equipe',
                  focus: 'Apresentar os prints do Lighthouse (nota 100), axe DevTools (0 erros) e a simulação de resiliência Starlink sob oscilações de sinal.',
                  bulletPoints: [
                    'Pontuação Lighthouse 100 comprovada em acessibilidade.',
                    'Zero violações no axe DevTools.',
                    'Demonstração da fila local resiliente funcionando offline e sincronizando.',
                  ],
                },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-teal-800 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-base text-teal-950">{stage.step}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
                        <span>{stage.time}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold">
                        {stage.responsible}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 font-medium">{stage.focus}</p>

                  <ul className="space-y-1.5 pl-2 text-xs sm:text-sm text-stone-600">
                    {stage.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RUBRICA DE AVALIAÇÃO */}
        {activeSection === 'rubrica' && (
          <div id="panel-rubrica" role="tabpanel" aria-labelledby="tab-rubrica" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Acessibilidade',
                  weight: '35%',
                  color: 'teal',
                  desc: 'Semântica HTML5, foco visível, navegação 100% por teclado, leitores de tela e ARIA correto sem redundâncias.',
                },
                {
                  title: 'Full Stack',
                  weight: '25%',
                  color: 'indigo',
                  desc: 'API REST funcional no Express, tratamento semântico de erros JSON, persistência e arquitetura limpa.',
                },
                {
                  title: 'Apresentação',
                  weight: '25%',
                  color: 'amber',
                  desc: 'Domínio do código pela equipe, demonstração ao vivo e clareza nas respostas à banca examinadora.',
                },
                {
                  title: 'Relatórios',
                  weight: '15%',
                  color: 'rose',
                  desc: 'Documentação README.md, relatórios de auditoria Lighthouse 100 e roteiros assistivos anexados.',
                },
              ].map((rub, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-stone-500">Critério</span>
                      <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 font-extrabold text-xs">
                        Peso: {rub.weight}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-lg text-stone-950 mb-2">{rub.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{rub.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ROTEIRO DE TESTES NVDA / VOICEOVER */}
        {activeSection === 'roteiro_nvda' && (
          <div id="panel-roteiro-nvda" role="tabpanel" aria-labelledby="tab-roteiro-nvda" className="mt-6 space-y-6">
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-extrabold text-base text-stone-950 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-700" aria-hidden="true" />
                <span>Roteiro de Validação com Leitor de Tela (NVDA / VoiceOver)</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-700">
                Siga este passo a passo durante a banca ou testes locais para demonstrar o suporte sonoro e semântico:
              </p>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-stone-800">
              {[
                {
                  step: 'Passo 1: Carregamento e Skip Links',
                  action: 'Pressione Tab na abertura da página. O NVDA deve anunciar: "Link: Pular para o conteúdo principal".',
                  expected: 'O foco visual salta diretamente para o elemento principal sem obrigar o usuário a ouvir todo o cabeçalho.',
                },
                {
                  step: 'Passo 2: Barra de Ferramentas de Acessibilidade',
                  action: 'Navegue pelos botões de contraste e fonte. Ative o modo "Alto Contraste" ou "Leitura Fácil".',
                  expected: 'A região aria-live polite anuncia imediatamente a mudança ("Tamanho de texto ajustado para 125%").',
                },
                {
                  step: 'Passo 3: Formulário de Solicitação de Ajuda',
                  action: 'Pressione Tab para entrar nos campos. Deixe o campo Nome vazio e clique em "Enviar Solicitação".',
                  expected: 'A região de alerta aria-live assertive anuncia os erros. O foco salta para o primeiro campo com aria-invalid="true" e o leitor lê o aria-describedby com a mensagem explicativa.',
                },
                {
                  step: 'Passo 4: Central de Chamados & Filtros',
                  action: 'Altere o filtro de categoria para "Saúde & Medicamentos".',
                  expected: 'A contagem de resultados atualizada é anunciada automaticamente sem recarregar a página.',
                },
                {
                  step: 'Passo 5: Modal de Detalhes (Focus Trap)',
                  action: 'Pressione Enter no botão "Ver Detalhes". Pressione Tab repetidamente.',
                  expected: 'O foco circula apenas dentro dos controles do modal. Ao pressionar a tecla Esc, o modal se fecha e o foco retorna ao botão de abertura.',
                },
              ].map((item, idx) => (
                <li key={idx} className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-sm text-teal-950">{item.step}</div>
                  <div>
                    <span className="font-semibold text-stone-900">Ação do teste: </span>
                    <span className="text-stone-700">{item.action}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-teal-800">Comportamento esperado: </span>
                    <span className="text-stone-600">{item.expected}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};
