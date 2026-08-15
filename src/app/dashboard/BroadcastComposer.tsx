import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../services/api/axios';
import { Send } from '../../lib/icons';
import { broadcastSchema, BroadcastSchema } from '../../services/schema/broadcast';

export function BroadcastComposer() {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BroadcastSchema>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      type: 'info',
      message: ''
    }
  });

  const onSubmit = async (data: BroadcastSchema) => {
    setLoading(true);
    try {
      await api.post('/super-admin/broadcasts', data);
      reset();
      toast.success('Aviso Global Enviado!');
    } catch (error) {
      console.error('Failed to send broadcast', error);
      toast.error('Erro ao enviar aviso global.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-8 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Send className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-bold text-slate-900">Avisos Globais (Broadcast)</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select 
            {...register('type')} 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          >
            <option value="info">Informação</option>
            <option value="warning">Aviso</option>
            <option value="error">Crítico</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
          <textarea 
            {...register('message')} 
            rows={3} 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none" 
            placeholder="Escreva o aviso que todas as escolas verão..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'A enviar...' : 'Transmitir Aviso'}
        </button>
      </form>
    </div>
  );
}
