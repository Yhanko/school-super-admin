import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api/axios';

interface Message {
  id: string;
  message: string;
  sender: {
    name: string;
    role: string;
  };
  createdAt: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  institution: {
    name: string;
  };
  createdBy: {
    name: string;
    email: string;
  };
  messages: Message[];
}

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('OPEN');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/super-admin/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setIsReplying(true);
    try {
      await api.post(`/super-admin/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage,
        status: replyStatus,
      });
      toast.success('Resposta enviada com sucesso');
      setReplyMessage('');
      fetchTickets();
      setSelectedTicket(null); // Close modal
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Erro ao enviar resposta');
    } finally {
      setIsReplying(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Suporte Técnico</h2>
          <p className="text-slate-500 mt-2">Gestão de tickets das escolas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">A carregar tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Nenhum ticket encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Assunto</th>
                  <th className="px-6 py-4 font-semibold">Escola</th>
                  <th className="px-6 py-4 font-semibold">Autor</th>
                  <th className="px-6 py-4 font-semibold">Prioridade</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold">Data</th>
                  <th className="px-6 py-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{ticket.title}</td>
                    <td className="px-6 py-4">{ticket.institution.name}</td>
                    <td className="px-6 py-4">
                      <div>{ticket.createdBy.name}</div>
                      <div className="text-xs text-slate-400">{ticket.createdBy.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setReplyStatus(ticket.status);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Ver e Responder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Responder Ticket</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-slate-700">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900">{selectedTicket.title}</h4>
                <p className="text-slate-600 mt-2 text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                <div className="space-y-4 border-t border-slate-200 pt-4">
                  <h4 className="font-semibold text-slate-900">Histórico</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {selectedTicket.messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg ${msg.sender.role === 'SUPER_ADMIN' ? 'bg-indigo-50 ml-8' : 'bg-slate-50 mr-8'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-slate-900">{msg.sender.name} ({msg.sender.role})</span>
                          <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alterar Estado</label>
                  <select 
                    value={replyStatus} 
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="OPEN">Em aberto (OPEN)</option>
                    <option value="IN_PROGRESS">Em progresso (IN_PROGRESS)</option>
                    <option value="CLOSED">Resolvido (CLOSED)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sua Mensagem</label>
                  <textarea
                    rows={4}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Escreva a resposta aqui..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReply}
                disabled={isReplying || !replyMessage.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isReplying ? 'A enviar...' : 'Enviar Resposta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
