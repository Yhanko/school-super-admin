import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api/axios';
import { exportToCSV } from '../../lib/exportToCSV';
import { Download } from '../../lib/icons';

interface Lead {
  id: string;
  name: string;
  schoolName: string;
  province: string;
  phone: string;
  email: string;
  students: number;
  plan: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (leadId: string) => {
    if (!window.confirm('Tem certeza que deseja converter este lead numa Escola oficial do sistema?')) {
      return;
    }

    setConvertingId(leadId);
    try {
      const res = await api.post(`/super-admin/leads/${leadId}/convert`);
      toast.success(res.data.message || 'Escola criada com sucesso!');
      fetchLeads();
    } catch (error: any) {
      console.error('Failed to convert lead:', error);
      toast.error(error.response?.data?.message || 'Erro ao converter lead');
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Interessados (Leads)</h2>
          <p className="text-slate-500 mt-2">Gestão de escolas interessadas na plataforma</p>
        </div>
        <button
          onClick={() => exportToCSV(leads, 'leads')}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">A carregar leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Nenhum interessado encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nome</th>
                  <th className="px-6 py-4 font-semibold">Escola</th>
                  <th className="px-6 py-4 font-semibold">Local</th>
                  <th className="px-6 py-4 font-semibold">Contacto</th>
                  <th className="px-6 py-4 font-semibold">Plano</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="px-6 py-4">{lead.schoolName}</td>
                    <td className="px-6 py-4">{lead.province}</td>
                    <td className="px-6 py-4">
                      <div>{lead.email}</div>
                      <div className="text-xs text-slate-400 mt-1">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {lead.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.status === 'CONVERTED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Convertido
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {lead.status !== 'CONVERTED' && (
                        <button
                          onClick={() => handleConvert(lead.id)}
                          disabled={convertingId === lead.id}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {convertingId === lead.id ? 'A converter...' : 'Aprovar / Converter'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
