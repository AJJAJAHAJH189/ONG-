import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Activity,
  Zap,
  RotateCcw,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Server,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { HelpRequest } from '../types';

interface StarlinkSimulatorProps {
  latencyMs: number;
  onLatencyChange: (ms: number) => void;
  offlineMode: boolean;
  onOfflineToggle: (offline: boolean) => void;
  announcePolite: (msg: string) => void;
  onSyncOfflineQueue: (syncedCount: number) => void;
}

export const StarlinkSimulator: React.FC<StarlinkSimulatorProps> = ({
  latencyMs,
  onLatencyChange,
  offlineMode,
  onOfflineToggle,
  announcePolite,
  onSyncOfflineQueue,
}) => {
  const [offlineQueue, setOfflineQueue] = useState<HelpRequest[]>([]);
  const [pingResult, setPingResult] = useState<{ time: number; status: 'ok' | 'failed' } | null>(
    null
  );
  const [isPinging, setIsPinging] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load offline queue from localStorage
  const checkOfflineQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('acesso_offline_queue') || '[]');
      setOfflineQueue(queue);
    } catch (e) {
      setOfflineQueue([]);
    }
  };

  useEffect(() => {
    checkOfflineQueue();
    const interval = setInterval(checkOfflineQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);

    if (offlineMode) {
      setTimeout(() => {
        setIsPinging(false);
        setPingResult({ time: 0, status: 'failed' });
        announcePolite('Teste de conexão falhou. Modo Starlink Offline está ativo.');
      }, 300);
      return;
    }

    const start = performance.now();
    try {
      if (latencyMs > 0) {
        await new Promise(r => setTimeout(r, latencyMs));
      }
      const res = await fetch('/api/health');
      const end = performance.now();
      const duration = Math.round(end - start);

      if (res.ok) {
        setPingResult({ time: duration, status: 'ok' });
        announcePolite(`Teste Starlink concluído com sucesso. Latência de ida e volta: ${duration} milissegundos.`);
      } else {
        setPingResult({ time: duration, status: 'failed' });
      }
    } catch (err) {
      setPingResult({ time: 0, status: 'failed' });
      announcePolite('Falha na resposta do servidor.');
    } finally {
      setIsPinging(false);
    }
  };

  const handleSyncQueue = async () => {
    if (offlineMode) {
      announcePolite('Não é possível sincronizar enquanto o modo Offline estiver ativado.');
      return;
    }

    if (offlineQueue.length === 0) {
      announcePolite('A fila resiliente local está vazia.');
      return;
    }

    setIsSyncing(true);
    announcePolite(`Iniciando sincronização de ${offlineQueue.length} chamados salvos localmente...`);

    try {
      let synced = 0;
      for (const item of offlineQueue) {
        const { id, ...payload } = item;
        await fetch('/api/help-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        synced++;
      }

      localStorage.removeItem('acesso_offline_queue');
      setOfflineQueue([]);
      onSyncOfflineQueue(synced);
      announcePolite(`Sincronização concluída! ${synced} chamados transmitidos para a base da ONG com sucesso.`);
    } catch (err) {
      announcePolite('Erro durante a sincronização. Os dados foram mantidos na fila local.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section
      id="starlink-simulator-section"
      aria-labelledby="heading-starlink"
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-stone-200 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-100 text-teal-800" aria-hidden="true">
                <Radio className="w-6 h-6" />
              </span>
              <h2 id="heading-starlink" className="text-2xl sm:text-3xl font-black text-teal-950">
                Simulador de Redes Rurais & Starlink
              </h2>
            </div>
            <p className="mt-1 text-sm sm:text-base text-stone-600">
              Ambiente de teste mandatório para validar <strong>latência via satélite (40–80ms)</strong>, oscilação de sinal e resiliência offline.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-300">
            <Activity className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span className="text-xs font-bold text-stone-800">
              Status: {offlineMode ? '🔴 Satélite Offline' : `🟢 Satélite Conectado (${latencyMs}ms)`}
            </span>
          </div>
        </div>

        {/* Educational Context Callout */}
        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-teal-950">
          <h3 className="font-extrabold text-sm text-teal-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700" aria-hidden="true" />
            <span>Por que isso é um pilar essencial de inclusão social?</span>
          </h3>
          <p className="text-teal-900 leading-relaxed">
            Muitas famílias vulneráveis e comunidades quilombolas, ribeirinhas e assentamentos agrícolas dependem exclusivamente de conexões satelitais (como Starlink) com alta latência e quedas durante tempestades. Para garantir que <strong>nenhum pedido de socorro ou medicamento seja perdido</strong>, nossa plataforma armazena o chamado com integridade no navegador e o sincroniza automaticamente no restabelecimento da rede.
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latency Slider */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-300 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-latency" className="font-bold text-sm text-stone-900">
                Latência de Satélite Simulada:
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-800 text-white font-extrabold text-xs">
                {latencyMs} ms
              </span>
            </div>

            <input
              id="slider-latency"
              type="range"
              min="0"
              max="250"
              step="10"
              value={latencyMs}
              onChange={e => {
                const val = Number(e.target.value);
                onLatencyChange(val);
                announcePolite(`Latência ajustada para ${val} milissegundos.`);
              }}
              className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />

            <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
              <span>0ms (Fibra Urbana)</span>
              <span className="text-teal-900 font-bold">40-80ms (Padrão Starlink)</span>
              <span>250ms (Chuva Severa)</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onLatencyChange(50)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                Definir 50ms (Típico)
              </button>
              <button
                type="button"
                onClick={() => onLatencyChange(80)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                Definir 80ms (Rural)
              </button>
              <button
                type="button"
                onClick={() => onLatencyChange(0)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-200 hover:bg-stone-300 text-stone-800"
              >
                Zero Latência
              </button>
            </div>
          </div>

          {/* Offline Mode & Satellite Drop */}
          <div className="p-5 bg-stone-50 rounded-xl border border-stone-300 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Simular Queda de Conexão Satélite (Offline)
              </h3>
              <p className="text-xs text-stone-600">
                Ative para testar como o formulário salva o chamado localmente sem travar a interface.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-toggle-offline"
                onClick={() => {
                  const next = !offlineMode;
                  onOfflineToggle(next);
                  announcePolite(
                    next
                      ? 'Simulação de perda de sinal Starlink ativada. Modo Offline ligado.'
                      : 'Sinal de satélite restabelecido. Modo Online ligado.'
                  );
                }}
                aria-pressed={offlineMode}
                className={`min-h-[48px] w-full px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  offlineMode
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'bg-emerald-700 text-white shadow-md hover:bg-emerald-800'
                }`}
              >
                {offlineMode ? (
                  <>
                    <WifiOff className="w-5 h-5" aria-hidden="true" />
                    <span>Modo Offline Ativado (Sem Sinal)</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-5 h-5" aria-hidden="true" />
                    <span>Conexão Online Ativa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Ping Benchmark */}
        <div className="mt-6 p-5 bg-stone-50 rounded-xl border border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-stone-900">Teste de Ping em Tempo Real (API REST)</h3>
            <p className="text-xs text-stone-600">
              Executa uma requisição contra o servidor Express simulando o canal de rede.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pingResult && (
              <div
                aria-live="polite"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  pingResult.status === 'ok'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {pingResult.status === 'ok' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    <span>Resposta em {pingResult.time} ms</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-700" aria-hidden="true" />
                    <span>Falha de Conexão</span>
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              id="btn-run-ping"
              onClick={handleTestPing}
              disabled={isPinging}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
            >
              {isPinging ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Activity className="w-4 h-4" aria-hidden="true" />
              )}
              <span>Executar Ping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Resilient Queue Management */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-950">
                Fila de Armazenamento Local Resiliente
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Chamados salvos no navegador quando o sinal de satélite cai.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 bg-stone-100 rounded-full border border-stone-300">
              {offlineQueue.length} {offlineQueue.length === 1 ? 'item na fila' : 'itens na fila'}
            </span>

            {offlineQueue.length > 0 && (
              <button
                type="button"
                onClick={handleSyncQueue}
                disabled={isSyncing || offlineMode}
                className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 shadow-sm ${
                  offlineMode
                    ? 'bg-stone-400 cursor-not-allowed'
                    : 'bg-teal-800 hover:bg-teal-900'
                }`}
                title={offlineMode ? 'Desative o modo offline para sincronizar' : 'Enviar chamados da fila local para o servidor'}
              >
                {isSyncing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" aria-hidden="true" />
                )}
                <span>Sincronizar Fila Agora</span>
              </button>
            )}
          </div>
        </div>

        {offlineQueue.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
            <p className="font-semibold text-stone-700">Tudo sincronizado!</p>
            <p className="text-xs text-stone-500">Nenhum chamado pendente de envio na fila local.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offlineQueue.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div>
                  <strong className="text-stone-900 block">{item.name}</strong>
                  <span className="text-stone-600 text-xs">
                    {item.city} • Categoria: {item.category} • Urgência: {item.urgency}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-xs">
                  Pronto para Sincronizar
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
