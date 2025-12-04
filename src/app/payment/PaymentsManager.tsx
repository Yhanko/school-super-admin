import { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

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

const MOCK_PAYMENTS: PaymentWithDetails[] = [
  {
    id: '1',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    parent_name: 'John Smith',
    student_name: 'Emma Smith',
    amount: 1500,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'credit_card',
    status: 'completed',
    description: 'Monthly tuition payment',
    transaction_id: 'TXN-2024-001',
    paid_at: '2024-12-01T10:30:00Z',
    created_at: '2024-12-01T10:30:00Z'
  },
  {
    id: '2',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    parent_name: 'Sarah Johnson',
    student_name: 'Michael Johnson',
    amount: 800,
    currency: 'USD',
    payment_type: 'activities',
    payment_method: 'bank_transfer',
    status: 'completed',
    description: 'Sports activities fee',
    transaction_id: 'TXN-2024-002',
    paid_at: '2024-11-30T14:15:00Z',
    created_at: '2024-11-30T14:15:00Z'
  },
  {
    id: '3',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    parent_name: 'Robert Davis',
    student_name: 'Jessica Davis',
    amount: 1500,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'credit_card',
    status: 'pending',
    description: 'Monthly tuition payment',
    transaction_id: 'TXN-2024-003',
    paid_at: null,
    created_at: '2024-12-03T09:00:00Z'
  },
  {
    id: '4',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    parent_name: 'Maria Garcia',
    student_name: 'Lucas Garcia',
    amount: 2000,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'paypal',
    status: 'completed',
    description: 'Quarterly tuition',
    transaction_id: 'TXN-2024-004',
    paid_at: '2024-11-28T11:45:00Z',
    created_at: '2024-11-28T11:45:00Z'
  },
  {
    id: '5',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    parent_name: 'James Wilson',
    student_name: 'Sophia Wilson',
    amount: 500,
    currency: 'USD',
    payment_type: 'exam_fees',
    payment_method: 'credit_card',
    status: 'failed',
    description: 'Standardized exam fee',
    transaction_id: 'TXN-2024-005',
    paid_at: null,
    created_at: '2024-12-02T16:20:00Z'
  },
  {
    id: '6',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    parent_name: 'Patricia Anderson',
    student_name: 'David Anderson',
    amount: 1200,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'bank_transfer',
    status: 'completed',
    description: 'Monthly tuition payment',
    transaction_id: 'TXN-2024-006',
    paid_at: '2024-11-25T08:30:00Z',
    created_at: '2024-11-25T08:30:00Z'
  },
  {
    id: '7',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    parent_name: 'Christopher Martinez',
    student_name: 'Isabella Martinez',
    amount: 300,
    currency: 'USD',
    payment_type: 'supplies',
    payment_method: 'credit_card',
    status: 'pending',
    description: 'School supplies package',
    transaction_id: 'TXN-2024-007',
    paid_at: null,
    created_at: '2024-12-03T13:50:00Z'
  },
  {
    id: '8',
    school_id: 'sch_002',
    school_name: 'Washington Academy',
    parent_name: 'Jennifer Brown',
    student_name: 'William Brown',
    amount: 1500,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'paypal',
    status: 'completed',
    description: 'Monthly tuition payment',
    transaction_id: 'TXN-2024-008',
    paid_at: '2024-11-22T15:10:00Z',
    created_at: '2024-11-22T15:10:00Z'
  },
  {
    id: '9',
    school_id: 'sch_001',
    school_name: 'Lincoln High School',
    parent_name: 'Linda Taylor',
    student_name: 'Olivia Taylor',
    amount: 650,
    currency: 'USD',
    payment_type: 'lab_fees',
    payment_method: 'credit_card',
    status: 'completed',
    description: 'Science lab equipment fee',
    transaction_id: 'TXN-2024-009',
    paid_at: '2024-11-20T12:25:00Z',
    created_at: '2024-11-20T12:25:00Z'
  },
  {
    id: '10',
    school_id: 'sch_003',
    school_name: 'Central Elementary',
    parent_name: 'Daniel Thomas',
    student_name: 'James Thomas',
    amount: 1800,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'bank_transfer',
    status: 'completed',
    description: 'Semester tuition',
    transaction_id: 'TXN-2024-010',
    paid_at: '2024-11-18T09:45:00Z',
    created_at: '2024-11-18T09:45:00Z'
  }
];

export function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    setPayments(MOCK_PAYMENTS);
    calculateStats(MOCK_PAYMENTS);
  }, []);

  const calculateStats = (paymentsData: Payment[]) => {
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
      payment.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());

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
          <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.completed} completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-600">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">${stats.pendingRevenue.toLocaleString()}</p>
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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by school, parent, student, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            />
          </div>

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
                    {payment.currency} {Number(payment.amount).toFixed(2)}
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
