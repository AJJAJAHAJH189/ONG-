import React, { useState, useId } from 'react';
import {
  Search,
  Filter,
  Eye,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  HeartHandshake,
  UserCheck,
  Phone,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { HelpRequest, NeedCategory, RequestStatus, UrgencyLevel, Volunteer } from '../types';

interface HelpRequestsBoardProps {
  requests: HelpRequest[];
  volunteers: Volunteer[];
  onOpenModal: (req: HelpRequest, opener: HTMLElement | null) => void;
  announcePolite: (msg: string) => void;
}

export const HelpRequestsBoard: React.FC<HelpRequestsBoardProps> = ({
  requests,
  volunteers,
  onOpenModal,
  announcePolite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const searchInputId = useId();
  const categoryFilterId = useId();
  const statusFilterId = useId();
  const urgencyFilterId = useId();

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedCategory !== 'todas' && req.category !== selectedCategory) return false;
    if (selectedStatus !== 'todos' && req.status !== selectedStatus) return false;
    if (selectedUrgency !== 'todas' && req.urgency !== selectedUrgency) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.name.toLowerCase().includes(q);
      const matchCity = req.city.toLowerCase().includes(q);
      const matchDesc = req.description.toLowerCase().includes(q);
      const matchAddress = req.address.toLowerCase().includes(q);
      return matchName || matchCity || matchDesc || matchAddress;
    }
    return true;
  });

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'category') setSelectedCategory(value);
    if (type === 'status') setSelectedStatus(value);
    if (type === 'urgency') setSelectedUrgency(value);

    // Calculate count after state updates
    setTimeout(() => {
      announcePolite(`Filtro atualizado. Encontrados ${filteredRequests.length} chamados.`);
    }, 100);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todas');
    setSelectedStatus('todos');
    setSelectedUrgency('todas');
    announcePolite('Filtros restaurados para exibição de todos os chamados.');
  };

  const getCategoryLabel = (cat: NeedCategory) => {
    const map: Record<NeedCategory, string> = {
      alimentacao: 'Alimentação / Cestas',
      saude_medicamentos: 'Saúde & Remédios',
      transporte_acessivel: 'Transporte Acessível',
      cuidados_companhia: 'Companhia & Apoio',
      apoio_juridico_social: 'Apoio Social / BPC',
      tecnologia_reparos: 'Tecnologia Assistiva',
    };
    return map[cat] || cat;
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
            <span>Pendente</span>
          </span>
        );
      case 'em_atendimento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <UserCheck className="w-3.5 h-3.5 text-blue-800" aria-hidden="true" />
            <span>Em Atendimento</span>
          </span>
        );
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" aria-hidden="true" />
            <span>Concluído</span>
          </span>
        );
    }
  };

  return (
    <section
      id="central-chamados-section"
      aria-labelledby="heading-central-chamados"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header and Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
                <HeartHandshake className="w-6 h-6" />
              </span>
              <h2 id="heading-central-chamados" className="text-2xl sm:text-3xl font-black text-teal-950">
                Central de Chamados Comunitários
              </h2>
            </div>
            <p className="mt-1 text-sm sm:text-base text-stone-600">
              Acompanhe pedidos de ajuda, voluntarie-se para atender e monitore o status em tempo real.
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div
            role="group"
            aria-label="Modo de visualização dos chamados"
            className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300 self-start md:self-center"
          >
            <button
              type="button"
              onClick={() => {
                setViewMode('cards');
                announcePolite('Visualização alterada para grade de cartões.');
              }}
              aria-pressed={viewMode === 'cards'}
              className={`min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              <span>Cartões</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('table');
                announcePolite('Visualização alterada para tabela de dados semântica.');
              }}
              aria-pressed={viewMode === 'table'}
              className={`min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <TableIcon className="w-4 h-4" aria-hidden="true" />
              <span>Tabela</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Search Input */}
          <div>
            <label htmlFor={searchInputId} className="block text-xs font-bold text-stone-900 mb-1">
              Buscar por nome ou local:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-stone-500" aria-hidden="true" />
              <input
                id={searchInputId}
                type="search"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Ex: Helena, Campinas, NVDA..."
                className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg border border-stone-400 bg-stone-50 text-sm text-stone-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor={categoryFilterId} className="block text-xs font-bold text-stone-900 mb-1">
              Filtrar por Categoria:
            </label>
            <select
              id={categoryFilterId}
              value={selectedCategory}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-stone-400 bg-stone-50 text-sm text-stone-900 focus:bg-white"
            >
              <option value="todas">Todas as categorias</option>
              <option value="alimentacao">Alimentação / Cestas</option>
              <option value="saude_medicamentos">Saúde & Remédios</option>
              <option value="transporte_acessivel">Transporte Acessível</option>
              <option value="cuidados_companhia">Companhia & Cuidados</option>
              <option value="apoio_juridico_social">Apoio Social / BPC</option>
              <option value="tecnologia_reparos">Tecnologia Assistiva</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor={statusFilterId} className="block text-xs font-bold text-stone-900 mb-1">
              Status do Atendimento:
            </label>
            <select
              id={statusFilterId}
              value={selectedStatus}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-stone-400 bg-stone-50 text-sm text-stone-900 focus:bg-white"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">⏳ Pendentes (Aguardando)</option>
              <option value="em_atendimento">🔄 Em Atendimento</option>
              <option value="concluido">✅ Concluídos</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label htmlFor={urgencyFilterId} className="block text-xs font-bold text-stone-900 mb-1">
              Nível de Urgência:
            </label>
            <select
              id={urgencyFilterId}
              value={selectedUrgency}
              onChange={e => handleFilterChange('urgency', e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-stone-400 bg-stone-50 text-sm text-stone-900 focus:bg-white"
            >
              <option value="todas">Todas as urgências</option>
              <option value="urgente">🚨 Urgente (24h)</option>
              <option value="alta">⚠️ Alta prioridade</option>
              <option value="media">ℹ️ Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
          </div>
        </div>

        {/* Results summary and reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-700">
          <div aria-live="polite" className="font-semibold">
            Mostrando <strong>{filteredRequests.length}</strong> de {requests.length} chamados registrados
          </div>
          {(selectedCategory !== 'todas' ||
            selectedStatus !== 'todos' ||
            selectedUrgency !== 'todas' ||
            searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty state if nothing matches */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-300 p-10 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" aria-hidden="true" />
          <h3 className="text-xl font-bold text-stone-800">Nenhum chamado encontrado com esses filtros</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Tente remover alguns filtros ou buscar por outro termo para visualizar as solicitações de ajuda.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-teal-800 text-white font-bold text-sm hover:bg-teal-900"
          >
            Ver todos os chamados
          </button>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" role="region" aria-label="Lista de Cartões de Chamados">
          {filteredRequests.map(req => {
            return (
              <article
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {getCategoryLabel(req.category)}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(req.status)}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          req.urgency === 'urgente'
                            ? 'bg-rose-100 text-rose-900'
                            : req.urgency === 'alta'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-stone-950 mt-2 mb-1">{req.name}</h3>

                  <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" aria-hidden="true" />
                    <span>{req.city} - {req.address}</span>
                  </div>

                  <p className="text-stone-800 text-sm font-normal line-clamp-3 bg-stone-50 p-3 rounded-xl border border-stone-200 mb-3">
                    {req.description}
                  </p>

                  {/* Accessibility tags */}
                  {req.specificNeeds && req.specificNeeds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {req.specificNeeds.map((need, idx) => (
                        <span
                          key={idx}
                          className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded border border-stone-300"
                        >
                          {need.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {req.assignedVolunteerName && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 bg-teal-50 p-2 rounded-lg border border-teal-200 mb-4">
                      <UserCheck className="w-4 h-4 text-teal-700 flex-shrink-0" aria-hidden="true" />
                      <span>Voluntário: {req.assignedVolunteerName}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-500">
                    Registrado em: {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <button
                    id={`btn-details-${req.id}`}
                    type="button"
                    onClick={e => onOpenModal(req, e.currentTarget)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm flex items-center gap-1.5 transition-colors shadow-xs"
                    aria-label={`Ver detalhes e gerenciar chamado de ${req.name}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span>Ver Detalhes / Atender</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW (Strictly accessible table semantics conforming to WCAG 1.3.1) */}
      {viewMode === 'table' && filteredRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <table role="table" className="w-full text-left text-sm border-collapse">
            <caption className="p-4 font-bold text-left text-teal-950 border-b border-stone-200 bg-stone-50">
              Tabela de Solicitações Comunitárias da ONG ConectaSolidária
            </caption>
            <thead className="bg-stone-100 text-stone-800 text-xs uppercase font-extrabold border-b border-stone-300">
              <tr>
                <th scope="col" className="p-3.5">
                  Solicitante
                </th>
                <th scope="col" className="p-3.5">
                  Categoria
                </th>
                <th scope="col" className="p-3.5">
                  Localização
                </th>
                <th scope="col" className="p-3.5">
                  Urgência
                </th>
                <th scope="col" className="p-3.5">
                  Status
                </th>
                <th scope="col" className="p-3.5 text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                  <th scope="row" className="p-3.5 font-bold text-stone-900 whitespace-nowrap">
                    <div>
                      <div>{req.name}</div>
                      <div className="text-xs font-normal text-stone-500">{req.phone}</div>
                    </div>
                  </th>
                  <td className="p-3.5 text-stone-700">
                    {getCategoryLabel(req.category)}
                  </td>
                  <td className="p-3.5 text-stone-700 whitespace-nowrap">
                    {req.city}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                        req.urgency === 'urgente'
                          ? 'bg-rose-100 text-rose-900 font-black'
                          : req.urgency === 'alta'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={e => onOpenModal(req, e.currentTarget)}
                      className="min-h-[44px] px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs inline-flex items-center gap-1"
                      aria-label={`Ver detalhes do chamado de ${req.name}`}
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Detalhes</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
