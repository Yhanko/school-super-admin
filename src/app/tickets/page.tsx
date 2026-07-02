"use client";

import { useState, useEffect } from 'react';
import api from '@/services/api/axios';
import { Button } from '@/components/ui/button';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/support/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">A carregar tickets...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Inbox de Suporte</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Ticket</th>
              <th className="p-4 font-semibold text-slate-700">Escola</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700">Prioridade</th>
              <th className="p-4 font-semibold text-slate-700">Data</th>
              <th className="p-4 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t: any) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-900">{t.title}</td>
                <td className="p-4 text-slate-600">{t.institution?.name || 'N/A'}</td>
                <td className="p-4">
                  <span className={px-2 py-1 text-xs font-semibold rounded-full }>
                    {t.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={px-2 py-1 text-xs font-semibold rounded-full }>
                    {t.priority}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <Button variant="outline" size="sm">Responder</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && <div className="p-8 text-center text-slate-500">Nenhum ticket encontrado.</div>}
      </div>
    </div>
  );
}
