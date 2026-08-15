import { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, TrendingUp, Clock, CheckCircle, XCircle, Download, FileText } from '../../lib/icons';
import api from '../../services/api/axios';
import { exportToCSV } from '../../lib/exportToCSV';
import { generateInvoice } from '../../lib/generateInvoice';

interface Payment {
  id: string;
  school_id: string;
  amount: number;
  currency: string;
  payment_type: string;
  payment_method: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string | null;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}

interface PaymentWithDetails extends Payment {
  school_name?: string;
  parent_name?: string;
  student_name?: string;
}

export function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await api.get('/super-admin/payments');
      const data = response.data.map((p: any) => ({
        id: p.id,
        school_id: p.student?.institution?.id || '',
        school_name: p.student?.institution?.name || 'N/A',
        student_name: p.student?.name || 'N/A',
        amount: p.amount,
        currency: 'AOA',
        payment_type: 'tuition',
        payment_method: p.paymentMethod || 'credit_card',
        status: p.status,
        description: '',
        transaction_id: p.id,
        paid_at: p.paymentDate,
        created_at: p.createdAt
      }));
      setPayments(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const calculateStats = (paymentsData: PaymentWithDetails[]) => {
    const completed = paymentsData.filter(p => p.status === 'completed');
    const pending = paymentsData.filter(p => p.status === 'pending');
    const failed = paymentsData.filter(p => p.status === 'failed');

    const totalRevenue = completed.reduce((sum, p) => sum + Number(p.amount), 0);
    const pendingRevenue = pending.reduce((sum, p) => sum + Number(p.amount), 0);

    setStats({
      total: paymentsData.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      totalRevenue,
      pendingRevenue
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.school_name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      payment.parent_name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      payment.student_name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(activeSearchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pagamentos & Transações</h2>
          <p className="text-slate-600 mt-1">Acompanhe todas as atividades de pagamento em todas as escolas</p>
        </div>
        <button
          onClick={() => exportToCSV(payments, 'payments')}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-slate-600">Total Receita</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">\</p>
          <p className="text-xs text-slate-500 mt-1">{stats.completed} concluídos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-600">Pendente</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">\</p>
          <p className="text-xs text-slate-500 mt-1">{stats.pending} pendentes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-slate-600">Taxa de Sucesso</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-slate-500 mt-1">de todas as transações</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-medium text-slate-600">Falhados</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.failed}</p>
          <p className="text-xs text-slate-500 mt-1">transações falhadas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por escola, encarregado, aluno ou ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveSearchTerm(searchTerm)}
            />
          </div>
          <button onClick={() => setActiveSearchTerm(searchTerm)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Buscar
          </button>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Escola</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Encarregado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Estudante</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Valor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Método</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Recibo</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm text-slate-600 capitalize">{payment.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">
                    {payment.school_name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">
                    {payment.parent_name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">
                    {payment.student_name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                    {Number(payment.amount).toLocaleString('pt-AO')} Kz
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 capitalize">
                    {payment.payment_type}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 capitalize">
                    {payment.payment_method || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 text-right">
                    <button
                      onClick={() => generateInvoice(payment)}
                      title="Baixar Recibo PDF"
                      className="text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <FileText className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhum pagamento encontrado com os critérios selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
