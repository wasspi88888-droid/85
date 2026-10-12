import React, { useState } from 'react';
import { X, Play, Code, Terminal, CheckCircle, Copy, Database, Shield, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SWAGGER_SPEC, CI_CD_PIPELINE_YAML, DOCKER_COMPOSE_SPEC, ApiEndpoint } from '../../constants/swaggerSpec';

export const SwaggerDocsModal: React.FC = () => {
  const { isSwaggerModalOpen, setIsSwaggerModalOpen, showToast } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [activeTab, setActiveTab] = useState<'endpoints' | 'cicd' | 'docker'>('endpoints');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [simulatedResponse, setSimulatedResponse] = useState<{ path: string; data: Record<string, unknown> } | null>(null);

  if (!isSwaggerModalOpen) return null;

  const tags = ['Tous', 'Authentification', 'Wallet', 'Kotani Pay', 'Messagerie', 'Télécom', 'Investissement'];

  const filteredEndpoints = selectedTag === 'Tous'
    ? SWAGGER_SPEC.endpoints
    : SWAGGER_SPEC.endpoints.filter((ep) => ep.tags.includes(selectedTag));

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    showToast(`${label} copié dans le presse-papier !`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTryOut = (ep: ApiEndpoint) => {
    setSimulatedResponse({
      path: ep.path,
      data: ep.responses[0]?.example || { status: 'OK' },
    });
    showToast(`Appel simulé vers ${ep.method} ${ep.path} (200 OK)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              API
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{SWAGGER_SPEC.info.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  v{SWAGGER_SPEC.info.version}
                </span>
              </div>
              <p className="text-xs text-gray-400">OpenAPI 3.0 • Node.js, PostgreSQL 15 & Redis TTL 5s</p>
            </div>
          </div>
          <button
            onClick={() => setIsSwaggerModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-6 gap-3 pt-2 text-xs">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2.5 font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'endpoints'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Endpoints REST & WebSocket
          </button>
          <button
            onClick={() => setActiveTab('cicd')}
            className={`pb-2.5 font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'cicd'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            CI/CD Pipeline (GitHub Actions)
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`pb-2.5 font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'docker'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Docker Compose (Postgres + Redis)
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              {/* Tag filters */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-100">
                {tags.map((tg) => (
                  <button
                    key={tg}
                    onClick={() => setSelectedTag(tg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedTag === tg
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tg}
                  </button>
                ))}
              </div>

              {/* Endpoints List */}
              <div className="space-y-3">
                {filteredEndpoints.map((ep, idx) => {
                  const methodColor =
                    ep.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : ep.method === 'GET'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300';

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-blue-300 transition space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border ${methodColor}`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-gray-900">{ep.path}</span>
                        </div>
                        <button
                          onClick={() => handleTryOut(ep)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition active:scale-95 cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-blue-600 fill-current" />
                          <span>Tester l&apos;endpoint</span>
                        </button>
                      </div>

                      <p className="text-xs text-gray-600">{ep.summary}</p>
                      <p className="text-[11px] text-gray-400">{ep.description}</p>

                      {/* Request and response preview */}
                      {ep.requestBody && (
                        <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 text-[11px]">
                          <span className="font-bold text-gray-700 uppercase tracking-wider block mb-1">
                            Payload Exemple :
                          </span>
                          <pre className="font-mono text-[10px] text-gray-600 overflow-x-auto">
                            {JSON.stringify(ep.requestBody.example, null, 2)}
                          </pre>
                        </div>
                      )}

                      {simulatedResponse && simulatedResponse.path === ep.path && (
                        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-[11px] animate-fade-in">
                          <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Réponse 200 OK (Simulée) :
                          </span>
                          <pre className="font-mono text-[10px] text-emerald-900 overflow-x-auto">
                            {JSON.stringify(simulatedResponse.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'cicd' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">.github/workflows/deploy.yml</span>
                <button
                  onClick={() => handleCopy(CI_CD_PIPELINE_YAML, 'Pipeline GitHub Actions')}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === 'Pipeline GitHub Actions' ? 'Copié !' : 'Copier YAML'}</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                {CI_CD_PIPELINE_YAML}
              </pre>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">docker-compose.yml</span>
                <button
                  onClick={() => handleCopy(DOCKER_COMPOSE_SPEC, 'Docker Compose')}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === 'Docker Compose' ? 'Copié !' : 'Copier Compose'}</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                {DOCKER_COMPOSE_SPEC}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
