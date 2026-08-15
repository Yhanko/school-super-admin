import { useState, useEffect } from 'react';
import api from '../../services/api/axios';
import { Activity } from '../../lib/icons';

interface HealthData {
  id: string;
  name: string;
  status: string;
  totalStudents: number;
  activeUsersL15D: number;
  healthStatus: 'GOOD' | 'AT_RISK' | 'CRITICAL' | 'BLOCKED';
}

export function HealthReport() {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await api.get('/super-admin/health');
        setHealthData(response.data);
      } catch (error) {
        console.error('Failed to load health report', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (loading) return <div>A carregar saude...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-200 flex items-center gap-3">
        <Activity className="w-6 h-6 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-900">Relatório de Saúde (Churn Rate)</h3>
      </div>
      <div className="p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3">Escola</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Ativos 15D / Total</th>
              <th className="pb-3">Saúde</th>
            </tr>
          </thead>
          <tbody>
            {healthData.map(school => (
              <tr key={school.id} className="border-b border-slate-100">
                <td className="py-3 text-slate-900 font-medium">{school.name}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium">
                    {school.status}
                  </span>
                </td>
                <td className="py-3 text-slate-600">
                  {school.activeUsersL15D} / {school.totalStudents}
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium">
                    {school.healthStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
