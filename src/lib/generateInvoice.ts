import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateInvoice(payment: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Recibo de Pagamento - YhankoEduca', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Invoice Details
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`ID da Transação: ${payment.transaction_id || payment.id}`, 14, 45);
  doc.text(`Data do Pagamento: ${payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}`, 14, 52);
  doc.text(`Estado: ${payment.status === 'completed' ? 'Completo' : payment.status}`, 14, 59);

  // Customer / School Details
  doc.text('Dados do Cliente/Escola:', 14, 75);
  doc.setFontSize(11);
  doc.text(`Escola: ${payment.school_name || 'N/A'}`, 14, 82);
  doc.text(`Aluno: ${payment.student_name || 'N/A'}`, 14, 89);
  
  // Table
  const tableData = [
    ['Descrição', 'Método', 'Moeda', 'Total'],
    [
      payment.description || 'Pagamento de Mensalidade / Plano',
      payment.payment_method || 'Cartão',
      payment.currency || 'AOA',
      `${payment.amount?.toFixed(2)}`
    ]
  ];

  (doc as any).autoTable({
    startY: 105,
    head: [tableData[0]],
    body: [tableData[1]],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] } // Indigo 600
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Obrigado por usar YhankoEduca!', 14, doc.internal.pageSize.height - 20);

  doc.save(`fatura_${payment.transaction_id || payment.id}.pdf`);
}
