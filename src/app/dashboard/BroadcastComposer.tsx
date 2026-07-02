import { useState } from 'react';
import api from '../../services/api/axios';
import { Send } from '../../lib/icons';

export function BroadcastComposer() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message) return;
    setLoading(true);
    try {
      await api.post('/super-admin/broadcasts', { message, type });
      setMessage('');
      alert('Aviso Global Enviado!');
    } catch (error) {
      console.error('Failed to send broadcast', error);
      alert('Erro ao enviar aviso global.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-8 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Send className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-bold text-slate-900">Avisos Globais (Broadcast)</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
            <option value="info">Informação</option>
            <option value="warning">Aviso</option>
            <option value="error">Crítico</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" placeholder="Escreva o aviso que todas as escolas verão..."></textarea>
        </div>
        <button onClick={handleSend} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'A enviar...' : 'Transmitir Aviso'}
        </button>
      </div>
    </div>
  );
}
