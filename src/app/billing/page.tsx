import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Building2, Ban, Lock, Search, AlertOctagon, MessageSquare, Clock } from '../../lib/icons';

type DebtorsResponse = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  subscriptions: any[];
  activityLogs: any[];
};

export default function BillingPage() {
  const [debtors, setDebtors] = useState<DebtorsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogs, setSelectedLogs] = useState<any[] | null>(null);

  const token = useAuthStore((state) => state.token);

  const fetchDebtors = async () => {
    try {
      const res = await fetch('http://localhost:3000/super-admin/billing/debtors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDebtors(data);
    } catch (error) {
      toast.error('Erro ao carregar escolas em dívida');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3000/super-admin/schools/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Estado atualizado com sucesso');
      fetchDebtors();
    } catch (error) {
      toast.error('Erro ao atualizar estado');
    }
  };

  const filteredDebtors = debtors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faturação e Dívidas</h1>
          <p className="text-slate-500 text-sm mt-1">Gere escolas com subscrições expiradas ou acessos restritos</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Procurar por escola..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Escola</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Estado Atual</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Subscrição Ativa</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-500">A carregar...</td></tr>
              ) : filteredDebtors.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-500">Nenhuma escola em dívida encontrada.</td></tr>
              ) : (
                filteredDebtors.map((school) => {
                  const activeSub = school.subscriptions.find(s => s.status === 'active');
                  const isExpired = activeSub && new Date(activeSub.endDate) < new Date();
                  
                  return (
                    <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{school.name}</p>
                            <p className="text-sm text-slate-500">{school.email || 'Sem email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          school.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                          school.status === 'payment_restricted' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          school.status === 'suspended' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {school.status === 'blocked' ? 'Bloqueado (Total)' :
                           school.status === 'payment_restricted' ? 'Restrito (Diretor Pode Pagar)' :
                           school.status === 'suspended' ? 'Suspenso' : 'Ativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {activeSub ? (
                          isExpired ? <span className="text-red-600 font-medium">Expirou a {new Date(activeSub.endDate).toLocaleDateString()}</span> :
                          <span>Expira a {new Date(activeSub.endDate).toLocaleDateString()}</span>
                        ) : 'Sem subscrição'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedLogs(school.activityLogs)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver Logs de SMS"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          {school.status !== 'payment_restricted' && (
                            <button
                              onClick={() => updateStatus(school.id, 'payment_restricted')}
                              className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Modo Restrito (Diretor paga)"
                            >
                              <AlertOctagon className="w-5 h-5" />
                            </button>
                          )}
                          {school.status !== 'blocked' && (
                            <button
                              onClick={() => updateStatus(school.id, 'blocked')}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Bloquear (Acesso Totalmente Vedado)"
                            >
                              <Ban className="w-5 h-5" />
                            </button>
                          )}
                          {(school.status === 'blocked' || school.status === 'payment_restricted') && (
                            <button
                              onClick={() => updateStatus(school.id, 'active')}
                              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Reativar Acesso"
                            >
                              <Lock className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Histórico de Avisos (SMS)</h3>
              <p className="text-sm text-slate-500 mt-1">Últimos SMS enviados (retidos por 7 dias)</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {selectedLogs.length === 0 ? (
                <p className="text-center text-slate-500">Nenhum SMS registado recentemente.</p>
              ) : (
                <ul className="space-y-4">
                  {selectedLogs.map((log) => (
                    <li key={log.id} className="flex gap-4 items-start">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-900">{log.details}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLogs(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
