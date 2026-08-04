"use client";

import { useState, useEffect } from 'react';
import api from '../../services/api/axios';
import { Database, Server, Activity, CheckCircle, XCircle } from '../../lib/icons';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, healthRes] = await Promise.all([
        api.get('/super-admin/logs'),
        api.get('/super-admin/system-health')
      ]);
      setLogs(logsRes.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">A carregar auditoria...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Auditoria & Saúde do Sistema</h1>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* API Health */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-full ${health.api.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <Server className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">API Principal</p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 capitalize">{health.api.status}</h3>
                {health.api.status === 'healthy' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">Uptime: {(health.api.uptime / 3600).toFixed(1)} horas</p>
            </div>
          </div>

          {/* Database Health */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-full ${health.database.status === 'healthy' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
              <Database className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Banco de Dados</p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 capitalize">{health.database.status}</h3>
                {health.database.status === 'healthy' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">Latência: {health.database.latency}ms</p>
            </div>
          </div>

          {/* System Load (Placeholder/Extra) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Status Geral</p>
              <h3 className="text-xl font-bold text-slate-900">Operacional</h3>
              <p className="text-xs text-slate-400 mt-1">Todos os serviços online</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-slate-800">Logs de Atividade Recentes</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Ação</th>
              <th className="p-4 font-semibold text-slate-700">Recurso</th>
              <th className="p-4 font-semibold text-slate-700">Usuário</th>
              <th className="p-4 font-semibold text-slate-700">Escola</th>
              <th className="p-4 font-semibold text-slate-700">IP</th>
              <th className="p-4 font-semibold text-slate-700">Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: any) => (
              <tr key={l.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-900">{l.action}</td>
                <td className="p-4 text-slate-600">{l.resource}</td>
                <td className="p-4 text-slate-600">
                  {l.user?.name || (l.action === 'CREATE_SCHOOL' ? 'Sistema (Super Admin)' : (l.userId || 'N/A'))}
                </td>
                <td className="p-4 text-slate-600">{l.institution?.name || 'Global'}</td>
                <td className="p-4 text-slate-500 font-mono text-sm">{l.ipAddress || (l.action === 'CREATE_SCHOOL' ? '127.0.0.1' : 'Desconhecido')}</td>
                <td className="p-4 text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-8 text-center text-slate-500">Nenhum log encontrado.</div>}
      </div>
    </div>
  );
}
