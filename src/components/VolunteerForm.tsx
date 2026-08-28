import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  Heart,
  Volume2,
} from 'lucide-react';
import { NeedCategory, Volunteer } from '../types';
import { speakText, isSpeechSupported } from '../utils/speech';

interface VolunteerFormProps {
  onSuccess: (newVol: Volunteer) => void;
  announcePolite: (msg: string) => void;
  announceAssertive: (msg: string) => void;
  starlinkLatency: number;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({
  onSuccess,
  announcePolite,
  announceAssertive,
  starlinkLatency,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: 'SP',
    skills: [] as NeedCategory[],
    accessibilityExperience: [] as string[],
    availability: 'finais_de_semana' as 'manha' | 'tarde' | 'noite' | 'finais_de_semana' | 'integral',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const skillsList: { id: NeedCategory; label: string; desc: string }[] = [
    {
      id: 'alimentacao',
      label: 'Distribuição de Alimentos / Cestas Básicas',
      desc: 'Arrecadação, montagem e entrega de cestas em domicílio.',
    },
    {
      id: 'saude_medicamentos',
      label: 'Apoio com Medicamentos & Saúde',
      desc: 'Retirada de receitas e remédios em farmácias populares.',
    },
    {
      id: 'transporte_acessivel',
      label: 'Transporte Solidário Acessível',
      desc: 'Condução de idosos e cadeirantes para exames e consultas.',
    },
    {
      id: 'cuidados_companhia',
      label: 'Companhia, Escuta & Cuidados',
      desc: 'Acolhimento e visitas para combate ao isolamento social.',
    },
    {
      id: 'apoio_juridico_social',
      label: 'Apoio Social & Benefícios (BPC/INSS)',
      desc: 'Auxílio na orientação e solicitação de direitos sociais.',
    },
    {
      id: 'tecnologia_reparos',
      label: 'Tecnologia Assistiva & Inclusão Digital',
      desc: 'Configuração de leitores de tela, acessibilidade em celulares e PC.',
    },
  ];

  const experienceOptions = [
    'Conhecimento de Leitores de Tela (NVDA / TalkBack / VoiceOver)',
    'Língua Brasileira de Sinais (Libras)',
    'Experiência no manuseio de cadeira de rodas e transferências',
    'Comunicação simples / Leitura fácil com neurodivergentes e idosos',
    'Condução em áreas rurais ou estradas de terra',
  ];

  const handleSkillToggle = (skill: NeedCategory) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleExpToggle = (exp: string) => {
    setFormData(prev => {
      const exists = prev.accessibilityExperience.includes(exp);
      return {
        ...prev,
        accessibilityExperience: exists
          ? prev.accessibilityExperience.filter(e => e !== exp)
          : [...prev.accessibilityExperience, exp],
      };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Por favor, insira o seu nome completo.';
    }

    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Por favor, forneça um endereço de e-mail válido para contato.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Por favor, insira seu telefone ou WhatsApp com DDD.';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Selecione pelo menos uma área em que você pode oferecer apoio voluntário.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);

    if (!validate()) {
      announceAssertive('Existem campos pendentes no cadastro de voluntário. Por favor, revise.');
      const firstError = Object.keys(errors)[0] || 'vol-name';
      const el = document.getElementById(`vol-${firstError}`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    announcePolite('Enviando seu cadastro de voluntário solidário...');

    try {
      if (starlinkLatency > 0) {
        await new Promise(r => setTimeout(r, starlinkLatency));
      }

      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        }
        announceAssertive(`Atenção: ${data.message}`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitSuccess(
        `Parabéns, ${formData.name}! Seu cadastro como voluntário(a) foi aprovado com sucesso! Agora você já pode assumir chamados na Central de Atendimentos.`
      );
      announcePolite(
        `Cadastro de voluntário realizado com sucesso para ${formData.name}. Obrigado por fazer parte da rede solidária!`
      );
      onSuccess(data.volunteer);

      // Reset
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        state: 'SP',
        skills: [],
        accessibilityExperience: [],
        availability: 'finais_de_semana',
        bio: '',
      });
      setErrors({});
    } catch (err) {
      setIsSubmitting(false);
      announceAssertive('Ocorreu uma falha na comunicação com o servidor. Tente novamente.');
    }
  };

  const handleReadInstructions = () => {
    const text =
      'Formulário de cadastro de voluntários. Informe seus dados de contato, selecione as áreas em que gostaria de ajudar, marque suas experiências com tecnologias assistivas e acessibilidade e defina seus horários de disponibilidade.';
    speakText(text, {
      onStart: () => announcePolite('Lendo instruções de voluntariado em áudio.'),
    });
  };

  return (
    <section
      id="cadastro-voluntario-section"
      aria-labelledby="heading-voluntario"
      className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto transition-colors"
    >
      <div className="border-b border-stone-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
              <Users className="w-6 h-6" />
            </span>
            <h2 id="heading-voluntario" className="text-2xl font-black text-teal-950">
              Cadastro de Voluntário(a) Solidário(a)
            </h2>
          </div>
          <p className="mt-1 text-sm sm:text-base text-stone-600">
            Junte-se à nossa rede de apoio para levar assistência direta, tecnologia e dignidade a quem mais precisa.
          </p>
        </div>

        {isSpeechSupported() && (
          <button
            type="button"
            onClick={handleReadInstructions}
            className="self-start sm:self-center min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 flex items-center gap-1.5 transition-colors"
            title="Ouvir instruções de voluntariado"
          >
            <Volume2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Ouvir Instruções</span>
          </button>
        )}
      </div>

      {submitSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex items-start gap-3"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-base text-emerald-900">Voluntário Cadastrado com Sucesso!</h3>
            <p className="text-sm mt-0.5">{submitSuccess}</p>
          </div>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-rose-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-base text-rose-900">Verifique os campos obrigatórios</h3>
            <p className="text-sm mt-0.5">
              Por favor, preencha todos os campos assinalados antes de enviar o formulário.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Fieldset 1: Dados Pessoais */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300 flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>1. Seus Dados Pessoais & Contato</span>
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            <div className="sm:col-span-2">
              <label htmlFor="vol-name" className="block text-sm font-bold text-stone-900 mb-1">
                Nome Completo <span className="text-rose-700">*</span>
              </label>
              <input
                id="vol-name"
                type="text"
                required
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'vol-err-name' : undefined}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 ${
                  errors.name ? 'border-2 border-rose-600 bg-rose-50/30' : 'border-stone-400 bg-white'
                }`}
                placeholder="Ex: Mariana Costa ou Pedro Alencar"
              />
              {errors.name && (
                <p id="vol-err-name" role="alert" className="mt-1.5 text-xs font-bold text-rose-800">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="vol-email" className="block text-sm font-bold text-stone-900 mb-1">
                Endereço de E-mail <span className="text-rose-700">*</span>
              </label>
              <input
                id="vol-email"
                type="email"
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'vol-err-email' : undefined}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 ${
                  errors.email ? 'border-2 border-rose-600 bg-rose-50/30' : 'border-stone-400 bg-white'
                }`}
                placeholder="Ex: mariana@exemplo.org"
              />
              {errors.email && (
                <p id="vol-err-email" role="alert" className="mt-1.5 text-xs font-bold text-rose-800">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="vol-phone" className="block text-sm font-bold text-stone-900 mb-1">
                Telefone / WhatsApp com DDD <span className="text-rose-700">*</span>
              </label>
              <input
                id="vol-phone"
                type="tel"
                required
                aria-required="true"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'vol-err-phone' : undefined}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base text-stone-900 ${
                  errors.phone ? 'border-2 border-rose-600 bg-rose-50/30' : 'border-stone-400 bg-white'
                }`}
                placeholder="Ex: (11) 99123-4567"
              />
              {errors.phone && (
                <p id="vol-err-phone" role="alert" className="mt-1.5 text-xs font-bold text-rose-800">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="vol-city" className="block text-sm font-bold text-stone-900 mb-1">
                Município onde você reside
              </label>
              <input
                id="vol-city"
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-stone-400 bg-white text-base text-stone-900"
                placeholder="Ex: São Paulo ou Campinas"
              />
            </div>

            <div>
              <label htmlFor="vol-availability" className="block text-sm font-bold text-stone-900 mb-1">
                Disponibilidade de Horário
              </label>
              <select
                id="vol-availability"
                value={formData.availability}
                onChange={e => setFormData({ ...formData, availability: e.target.value as any })}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-stone-400 bg-white text-base text-stone-900"
              >
                <option value="finais_de_semana">Finais de Semana</option>
                <option value="manha">Período da Manhã (Dias úteis)</option>
                <option value="tarde">Período da Tarde (Dias úteis)</option>
                <option value="noite">Período Noturno</option>
                <option value="integral">Horário Flexível / Integral</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Fieldset 2: Áreas de Habilidade */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>2. Áreas de Atuação & Apoio Voluntário</span>
          </legend>

          <div className="mt-4">
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Selecione as categorias em que você gostaria de atuar:{' '}
              <span className="text-rose-700">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Habilidades para voluntariado">
              {skillsList.map(s => {
                const isChecked = formData.skills.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-teal-700 bg-teal-50/80 font-semibold text-teal-950 ring-1 ring-teal-600'
                        : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSkillToggle(s.id)}
                      className="w-5 h-5 rounded text-teal-700 border-stone-400 focus:ring-teal-700 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold block">{s.label}</span>
                      <span className="text-stone-600 font-normal">{s.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.skills && (
              <p role="alert" className="mt-2 text-xs font-bold text-rose-800">
                {errors.skills}
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Experiência Prévia com Acessibilidade e Inclusão (Opcional):
            </label>
            <div className="space-y-2.5" role="group" aria-label="Experiências em acessibilidade">
              {experienceOptions.map((exp, idx) => {
                const isChecked = formData.accessibilityExperience.includes(exp);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
                      isChecked
                        ? 'border-teal-700 bg-teal-50/70 text-teal-950 font-medium'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleExpToggle(exp)}
                      className="w-4 h-4 rounded text-teal-700 border-stone-400 focus:ring-teal-700"
                    />
                    <span className="text-xs sm:text-sm">{exp}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </fieldset>

        {/* Fieldset 3: Apresentação */}
        <fieldset className="border border-stone-300 rounded-xl p-5 sm:p-6 bg-stone-50/50">
          <legend className="px-3 font-bold text-lg text-teal-950 bg-stone-100 rounded-md border border-stone-300">
            3. Conte um pouco sobre você e sua motivação
          </legend>

          <div className="mt-4">
            <label htmlFor="vol-bio" className="block text-sm font-bold text-stone-900 mb-1">
              Breve apresentação ou mensagem para os beneficiários
            </label>
            <textarea
              id="vol-bio"
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 rounded-lg border border-stone-400 bg-white text-base text-stone-900"
              placeholder="Ex: Tenho facilidade com tecnologia e gostaria de apoiar idosos da minha região nos finais de semana..."
            ></textarea>
          </div>
        </fieldset>

        <div className="flex justify-end pt-2">
          <button
            id="btn-submit-vol"
            type="submit"
            disabled={isSubmitting}
            className="min-h-[52px] w-full sm:w-auto px-8 py-3 rounded-xl font-extrabold text-base text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 shadow-md flex items-center justify-center gap-2.5 transition-all"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Cadastrando Voluntário...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                <span>Confirmar Cadastro de Voluntário</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
