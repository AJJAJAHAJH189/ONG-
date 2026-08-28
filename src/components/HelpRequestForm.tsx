import React, { useState } from 'react';
import {
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  FileText,
  Volume2,
  WifiOff,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';
import { NeedCategory, SpecificNeed, UrgencyLevel, HelpRequest } from '../types';
import { speakText, isSpeechSupported } from '../utils/speech';

interface HelpRequestFormProps {
  onSuccess: (newReq: HelpRequest) => void;
  announcePolite: (msg: string) => void;
  announceAssertive: (msg: string) => void;
  starlinkOffline: boolean;
  starlinkLatency: number;
}

export const HelpRequestForm: React.FC<HelpRequestFormProps> = ({
  onSuccess,
  announcePolite,
  announceAssertive,
  starlinkOffline,
  starlinkLatency,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: 'SP',
    address: '',
    category: 'alimentacao' as NeedCategory,
    specificNeeds: [] as SpecificNeed[],
    urgency: 'media' as UrgencyLevel,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const categories: { id: NeedCategory; label: string; description: string }[] = [
    {
      id: 'alimentacao',
      label: 'Alimentação & Cesta Básica',
      description: 'Alimentos não perecíveis, refeições prontas ou dietas específicas adaptadas.',
    },
    {
      id: 'saude_medicamentos',
      label: 'Saúde, Remédios & Curativos',
      description: 'Retirada de medicamentos no posto, auxílio com receitas e acompanhamento.',
    },
    {
      id: 'transporte_acessivel',
      label: 'Transporte & Mobilidade Acessível',
      description: 'Veículo com rampa/apoio para consultas médicas, vacinação ou órgãos públicos.',
    },
    {
      id: 'cuidados_companhia',
      label: 'Companhia, Cuidados & Conversa',
      description: 'Apoio humanizado, leitura de cartas, conversa para idosos e pessoas isoladas.',
    },
    {
      id: 'apoio_juridico_social',
      label: 'Apoio Social, BPC & Documentos',
      description: 'Auxílio na inscrição de benefícios sociais, CadÚnico, INSS e documentação.',
    },
    {
      id: 'tecnologia_reparos',
      label: 'Acessibilidade Digital & Reparos',
      description: 'Configuração de leitores de tela, acessibilidade em celulares e pequenos reparos.',
    },
  ];

  const accessibilityOptions: { id: SpecificNeed; label: string; desc: string }[] = [
    {
      id: 'deficiencia_visual',
      label: 'Deficiência Visual (Cego / Baixa Visão)',
      desc: 'Necessita de áudio-descrição ou leitor de tela nas orientações.',
    },
    {
      id: 'deficiencia_auditiva_libras',
      label: 'Deficiência Auditiva / Usuário de Libras',
      desc: 'Comunicação preferencial por mensagens de texto, WhatsApp ou intérprete.',
    },
    {
      id: 'mobilidade_reduzida',
      label: 'Mobilidade Reduzida / Cadeirante',
      desc: 'Necessita de apoio com acessibilidade física e locomoção.',
    },
    {
      id: 'idoso_apoio_digital',
      label: 'Pessoa Idosa / Apoio Passo a Passo',
      desc: 'Explicações calmas, linguagem simples e sem termos técnicos.',
    },
    {
      id: 'neurodivergente_leitura_facil',
      label: 'Neurodivergente (Autismo, TDAH, Dislexia)',
      desc: 'Instruções diretas em formato de leitura fácil.',
    },
  ];

  const handleNeedToggle = (need: SpecificNeed) => {
    setFormData(prev => {
      const exists = prev.specificNeeds.includes(need);
      const updated = exists
        ? prev.specificNeeds.filter(n => n !== need)
        : [...prev.specificNeeds, need];
      return { ...prev, specificNeeds: updated };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Por favor, informe seu nome completo com pelo menos 3 caracteres.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Por favor, forneça um número de telefone com DDD para entrarmos em contato.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Por favor, informe o seu município ou comunidade rural.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Informe a rua, número, bairro ou ponto de referência comunitário.';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Descreva com detalhes o tipo de ajuda que você precisa (mínimo de 10 caracteres).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);

    if (!validate()) {
      announceAssertive(
        'Existem erros no formulário. Por favor, revise os campos destacados em vermelho.'
      );
      // Move focus to first error field
      const firstErrorKey = Object.keys(errors)[0] || 'input-name';
      const el = document.getElementById(`input-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    announcePolite('Enviando sua solicitação de ajuda. Aguarde...');

    // Resilient offline simulation handling (for rural areas/Starlink drops)
    if (starlinkOffline) {
      // Simulate queuing locally in indexed DB / localStorage
      setTimeout(() => {
        const offlineItem: HelpRequest = {
          id: `req-offline-${Date.now().toString().slice(-4)}`,
          ...formData,
          status: 'pendente',
          createdAt: new Date().toISOString(),
        };

        const existingQueue = JSON.parse(localStorage.getItem('acesso_offline_queue') || '[]');
        existingQueue.push(offlineItem);
        localStorage.setItem('acesso_offline_queue', JSON.stringify(existingQueue));

        setIsSubmitting(false);
        setSubmitSuccess(
          'Conexão offline detectada (Área Rural / Starlink sem sinal). Seu chamado foi salvo com total segurança na fila local e será transmitido automaticamente assim que o sinal for restabelecido!'
        );
        announcePolite(
          'Chamado salvo com segurança na fila resiliente local. Será transmitido quando a rede restabelecer.'
        );
        onSuccess(offlineItem);
        resetForm();
      }, starlinkLatency || 400);
      return;
    }

    try {
      // Add simulated latency for rural Starlink testing
      if (starlinkLatency > 0) {
        await new Promise(r => setTimeout(r, starlinkLatency));
      }

      const response = await fetch('/api/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        }
        announceAssertive(`Erro ao enviar: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitSuccess(
        'Solicitação de ajuda enviada com sucesso! Nossos voluntários e equipe de assistência comunitária foram acionados.'
      );
      announcePolite(
        'Sua solicitação de ajuda foi cadastrada com sucesso! Em breve um voluntário entrará em contato.'
      );
      onSuccess(data.request);
      resetForm();
    } catch (err) {
      setIsSubmitting(false);
      // Fallback offline queue
      const offlineItem: HelpRequest = {
        id: `req-local-${Date.now().toString().slice(-4)}`,
        ...formData,
        status: 'pendente',
        createdAt: new Date().toISOString(),
      };
      const existingQueue = JSON.parse(localStorage.getItem('acesso_offline_queue') || '[]');
      existingQueue.push(offlineItem);
      localStorage.setItem('acesso_offline_queue', JSON.stringify(existingQueue));

      setSubmitSuccess(
        'Houve uma instabilidade momentânea na conexão, mas seu chamado foi guardado na fila local do seu dispositivo e será sincronizado!'
      );
      announcePolite('Chamado salvo localmente devido à oscilação de sinal.');
      onSuccess(offlineItem);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      city: '',
      state: 'SP',
      address: '',
      category: 'alimentacao',
      specificNeeds: [],
      urgency: 'media',
      description: '',
    });
    setErrors({});
  };

  const handleReadInstructions = () => {
    const text =
      'Formulário de solicitação de ajuda. Preencha seu nome, telefone de contato, endereço e o tipo de auxílio necessário. Você também pode marcar se possui alguma necessidade de acessibilidade, como deficiência visual, auditiva ou locomoção reduzida. Ao clicar em Enviar Solicitação, os voluntários cadastrados receberão seu chamado.';
    speakText(text, {
      onStart: () => announcePolite('Lendo instruções do formulário em áudio.'),
      onEnd: () => announcePolite('Fim das instruções.'),
    });
  };

  return (
    <section
      id="solicitar-ajuda-section"
      aria-labelledby="heading-solicitar-ajuda"
      className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto transition-colors"
    >
      {/* Header section with accessible audio helper */}
      <div className="border-b border-stone-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
              <HeartHandshake className="w-6 h-6" />
            </span>
            <h2 id="heading-solicitar-ajuda" className="text-2xl font-black text-teal-950">
              Solicitar Ajuda Comunitária
            </h2>
          </div>
          <p className="mt-1 text-sm sm:text-base text-stone-600">
            Destinado a <strong>idosos, pessoas com deficiência e famílias em situação vulnerável</strong>.
          </p>
        </div>

        {isSpeechSupported() && (
          <button
            type="button"
            onClick={handleReadInstructions}
            className="self-start sm:self-center min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 flex items-center gap-1.5 transition-colors"
            title="Ouvir explicação em áudio de como preencher o formulário"
          >
            <Volume2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Ouvir Instruções</span>
          </button>
        )}
      </div>

      {/* Success Notification Alert with polite live region */}
      {submitSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex items-start gap-3"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-base text-emerald-900">Solicitação Registrada!</h3>
            <p className="text-sm mt-0.5">{submitSuccess}</p>
          </div>
        </div>
      )}

      {/* General Error Banner if form has errors */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-rose-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-base text-rose-900">Atenção: Revise os dados informados</h3>
            <p className="text-sm mt-0.5">
              Existem {Object.keys(errors).length} campo(s) obrigatório(s) que precisam de correção antes de continuar.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Fieldset 1: Dados de Identificação e Contato */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>1. Quem precisa de ajuda? (Identificação e Contato)</span>
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            {/* Nome Completo */}
            <div className="sm:col-span-2">
              <label htmlFor="input-name" className="block text-sm font-bold text-stone-900 mb-1">
                Nome completo da pessoa que precisa de apoio{' '}
                <span className="text-rose-700" aria-hidden="true">*</span>
                <span className="sr-only">(Campo obrigatório)</span>
              </label>
              <input
                id="input-name"
                name="name"
                type="text"
                required
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'error-name help-name' : 'help-name'}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 transition-colors ${
                  errors.name
                    ? 'border-2 border-rose-600 bg-rose-50/30'
                    : 'border-stone-400 bg-white focus:border-teal-700'
                }`}
                placeholder="Ex: Dona Helena Silveira ou Sr. Francisco"
              />
              <p id="help-name" className="mt-1 text-xs text-stone-600">
                Pode ser o seu próprio nome ou o de quem você está representando.
              </p>
              {errors.name && (
                <p id="error-name" role="alert" className="mt-1.5 text-xs font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Telefone / WhatsApp */}
            <div>
              <label htmlFor="input-phone" className="block text-sm font-bold text-stone-900 mb-1">
                Telefone ou WhatsApp com DDD{' '}
                <span className="text-rose-700" aria-hidden="true">*</span>
                <span className="sr-only">(Campo obrigatório)</span>
              </label>
              <div className="relative">
                <input
                  id="input-phone"
                  name="phone"
                  type="tel"
                  required
                  aria-required="true"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'error-phone help-phone' : 'help-phone'}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 transition-colors ${
                    errors.phone
                      ? 'border-2 border-rose-600 bg-rose-50/30'
                      : 'border-stone-400 bg-white focus:border-teal-700'
                  }`}
                  placeholder="Ex: (11) 98765-4321"
                />
              </div>
              <p id="help-phone" className="mt-1 text-xs text-stone-600">
                Usado pelo voluntário para confirmar o atendimento.
              </p>
              {errors.phone && (
                <p id="error-phone" role="alert" className="mt-1.5 text-xs font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Município / Comunidade */}
            <div>
              <label htmlFor="input-city" className="block text-sm font-bold text-stone-900 mb-1">
                Município ou Região Rural{' '}
                <span className="text-rose-700" aria-hidden="true">*</span>
                <span className="sr-only">(Campo obrigatório)</span>
              </label>
              <input
                id="input-city"
                name="city"
                type="text"
                required
                aria-required="true"
                aria-invalid={errors.city ? 'true' : 'false'}
                aria-describedby={errors.city ? 'error-city help-city' : 'help-city'}
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 transition-colors ${
                  errors.city
                    ? 'border-2 border-rose-600 bg-rose-50/30'
                    : 'border-stone-400 bg-white focus:border-teal-700'
                }`}
                placeholder="Ex: Campinas (Zona Rural) ou São Paulo"
              />
              <p id="help-city" className="mt-1 text-xs text-stone-600">
                Se for área rural atendida por satélite, mencione aqui.
              </p>
              {errors.city && (
                <p id="error-city" role="alert" className="mt-1.5 text-xs font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            {/* Endereço Completo com Ponto de Referência */}
            <div className="sm:col-span-2">
              <label htmlFor="input-address" className="block text-sm font-bold text-stone-900 mb-1">
                Endereço completo ou ponto de referência comunitário{' '}
                <span className="text-rose-700" aria-hidden="true">*</span>
                <span className="sr-only">(Campo obrigatório)</span>
              </label>
              <input
                id="input-address"
                name="address"
                type="text"
                required
                aria-required="true"
                aria-invalid={errors.address ? 'true' : 'false'}
                aria-describedby={errors.address ? 'error-address help-address' : 'help-address'}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 transition-colors ${
                  errors.address
                    ? 'border-2 border-rose-600 bg-rose-50/30'
                    : 'border-stone-400 bg-white focus:border-teal-700'
                }`}
                placeholder="Ex: Sítio São José Km 8 ou Rua dos Cravos 200, próx. ao posto"
              />
              <p id="help-address" className="mt-1 text-xs text-stone-600">
                Inclua detalhes como travessas, porteira, número de casa ou pontos fáceis de localizar.
              </p>
              {errors.address && (
                <p id="error-address" role="alert" className="mt-1.5 text-xs font-bold text-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Fieldset 2: Categoria do Apoio e Necessidades Especiais */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>2. Que tipo de ajuda é necessária?</span>
          </legend>

          {/* Categoria de Ajuda */}
          <div className="mt-4">
            <label htmlFor="select-category" className="block text-sm font-bold text-stone-900 mb-1">
              Categoria Principal do Chamado{' '}
              <span className="text-rose-700" aria-hidden="true">*</span>
            </label>
            <select
              id="select-category"
              name="category"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as NeedCategory })}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-stone-400 bg-white text-base text-stone-900 focus:border-teal-700"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Necessidades Específicas / Acessibilidade */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Necessidades Específicas de Acessibilidade (Selecione todas que se aplicam):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Necessidades Específicas de Acessibilidade">
              {accessibilityOptions.map(opt => {
                const isChecked = formData.specificNeeds.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-teal-700 bg-teal-50/70 font-semibold text-teal-950 ring-1 ring-teal-600'
                        : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-${opt.id}`}
                      checked={isChecked}
                      onChange={() => handleNeedToggle(opt.id)}
                      className="w-5 h-5 rounded text-teal-700 border-stone-400 focus:ring-teal-700 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold block">{opt.label}</span>
                      <span className="text-stone-600 font-normal">{opt.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Nível de Urgência */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Nível de Urgência do Chamado:
            </label>
            <div
              role="radiogroup"
              aria-label="Grau de urgência da solicitação"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { id: 'baixa', label: 'Baixa', note: 'Pode aguardar alguns dias' },
                { id: 'media', label: 'Média', note: 'Atendimento nesta semana' },
                { id: 'alta', label: 'Alta', note: 'Necessário nos próximos 2 dias' },
                { id: 'urgente', label: 'Urgente', note: 'Necessidade imediata (24h)' },
              ].map(item => {
                const isSelected = formData.urgency === item.id;
                return (
                  <label
                    key={item.id}
                    className={`flex flex-col p-3 rounded-lg border cursor-pointer text-center min-h-[44px] justify-center transition-all ${
                      isSelected
                        ? 'border-2 border-teal-800 bg-teal-100/80 font-black text-teal-950 shadow-sm'
                        : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={item.id}
                      checked={isSelected}
                      onChange={() => setFormData({ ...formData, urgency: item.id as UrgencyLevel })}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold capitalize">{item.label}</span>
                    <span className="text-[11px] text-stone-600 mt-0.5">{item.note}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </fieldset>

        {/* Fieldset 3: Descrição Detalhada */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>3. Descrição Detalhada do Pedido</span>
          </legend>

          <div className="mt-4">
            <label htmlFor="input-description" className="block text-sm font-bold text-stone-900 mb-1">
              Explique com suas palavras o que você precisa{' '}
              <span className="text-rose-700" aria-hidden="true">*</span>
            </label>
            <textarea
              id="input-description"
              name="description"
              rows={4}
              required
              aria-required="true"
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'error-description help-desc' : 'help-desc'}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full p-3.5 rounded-lg border text-base text-stone-900 transition-colors ${
                errors.description
                  ? 'border-2 border-rose-600 bg-rose-50/30'
                  : 'border-stone-400 bg-white focus:border-teal-700'
              }`}
              placeholder="Exemplo: Preciso de auxílio para buscar remédios controlados de pressão no posto de saúde central e de um voluntário que me explique os horários com clareza..."
            ></textarea>
            <div className="flex justify-between items-center mt-1 text-xs text-stone-600">
              <span id="help-desc">
                Descreva claramente se precisa de transporte, apoio digital, alimentos específicos ou companhia.
              </span>
              <span aria-live="polite" className="font-semibold">
                {formData.description.length} caracteres
              </span>
            </div>
            {errors.description && (
              <p id="error-description" role="alert" className="mt-1.5 text-xs font-bold text-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>
        </fieldset>

        {/* Offline / Starlink notice indicator */}
        {starlinkOffline && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-2.5 text-xs sm:text-sm">
            <WifiOff className="w-5 h-5 text-amber-700 flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>Modo Rural/Starlink Offline:</strong> Seu formulário será armazenado localmente e sincronizado de forma resiliente assim que o sinal retornar.
            </span>
          </div>
        )}

        {/* Submit button with accessible loading states */}
        <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-stone-600">
            Todos os campos marcados com <span className="text-rose-700 font-bold">*</span> são de preenchimento obrigatório.
          </p>

          <button
            id="btn-submit-help"
            type="submit"
            disabled={isSubmitting}
            className={`min-h-[52px] w-full sm:w-auto px-8 py-3 rounded-xl font-extrabold text-base text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 shadow-md flex items-center justify-center gap-2.5 transition-all ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Processando Envio...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                <span>Enviar Solicitação de Ajuda</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
