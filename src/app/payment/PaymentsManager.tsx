import { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, TrendingUp, Clock, CheckCircle, XCircle } from '../../lib/icons';
import api from '../../services/api/axios';

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Payments & Transactions</h2>
        <p className="text-slate-600 mt-1">Track all payment activities across schools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-slate-600">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">\</p>
          <p className="text-xs text-slate-500 mt-1">{stats.completed} completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-600">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">\</p>
          <p className="text-xs text-slate-500 mt-1">{stats.pending} pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-slate-600">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-slate-500 mt-1">of all transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-medium text-slate-600">Failed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.failed}</p>
          <p className="text-xs text-slate-500 mt-1">failed transactions</p>
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
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">School</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Parent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Method</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
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
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No payments found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
