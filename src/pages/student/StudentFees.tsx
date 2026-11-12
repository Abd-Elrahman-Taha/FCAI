import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { useAuth } from '../../context/AuthContext';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { Modal } from '../../components/common/Modal';
import type { StudentFee } from '../../types';

export const StudentFees: React.FC = () => {
  const { showToast } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fawry Payment Flow Modal
  const [payingFee, setPayingFee] = useState<StudentFee | null>(null);
  const [paymentState, setPaymentState] = useState<'pending' | 'processing' | 'paid' | 'failed'>('pending');
  const [transactionRef, setTransactionRef] = useState<string>('');

  const loadFees = () => {
    setLoading(true);
    fakeApi.getFees().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleStartFawryPayment = async () => {
    if (!payingFee) return;
    setPaymentState('processing');

    try {
      const res = await fakeApi.payFeeFawry(payingFee.id);
      if (res.success) {
        setTransactionRef(res.transactionRef);
        setPaymentState('paid');
        showToast('Payment Verified', 'Fawry payment gateway reconciliation confirmed.', 'success');
        loadFees();
      }
    } catch (err: any) {
      setPaymentState('failed');
      showToast('Payment Failed', 'Transaction was declined by provider.', 'error');
    }
  };

  if (loading || !data) return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;

  const { unpaidTotal, paidTotal, currentSemesterTotal, fees } = data;

  return (
    <div>
      <PageHead
        title="Fees &amp; Financial Dashboard"
        desc="Tuition invoices, electronic settlements, and official digital receipts."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Fees & Payments']]}
      />

      {/* KPI Cards Row */}
      <div className="grid g-3 mb-6">
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Outstanding Balance</span>
            <span className="kpi-ico danger"><Icon name="wallet" /></span>
          </div>
          <div className="kpi-value text-danger">EGP {unpaidTotal.toLocaleString()}</div>
          <div className="kpi-meta"><span className="trend-down">Due by October 20, 2026</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Total Settled</span>
            <span className="kpi-ico info"><Icon name="checkCircle" /></span>
          </div>
          <div className="kpi-value">EGP {paidTotal.toLocaleString()}</div>
          <div className="kpi-meta"><span className="text-xs muted">Reconciled electronic payments</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Active Term Dues</span>
            <span className="kpi-ico info"><Icon name="receipt" /></span>
          </div>
          <div className="kpi-value">EGP {currentSemesterTotal.toLocaleString()}</div>
          <div className="kpi-meta"><span className="text-xs muted">Fall 2026 Academic Term</span></div>
        </div>
      </div>

      {/* Official Fawry Payment Notice - Compact */}
      <div className="alert alert-info mb-6" style={{ padding: '12px 16px' }}>
        <Icon name="info" size="sm" />
        <div className="text-xs">
          <b>Fawry Electronic Gateway:</b> Tuition fees are reconciled electronically in real-time. Partial payments are prohibited by university regulations.
        </div>
      </div>

      {/* Simplified, Clean Fee Invoices Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="receipt" size="sm" /> Invoices &amp; Receipts</h3>
            <p>Review invoice details, applied scholarships, and official receipts.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: '240px' }}>Invoice Description</th>
                <th style={{ width: '160px' }}>Amount</th>
                <th style={{ width: '150px' }}>Date</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '150px' }} className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee: StudentFee) => (
                <tr key={fee.id}>
                  {/* Invoice Description & Term */}
                  <td>
                    <div className="col gap-1">
                      <b style={{ fontSize: '14px' }}>{fee.feeType}</b>
                      <span className="text-xs muted">{fee.semester} · {fee.academicYear}</span>
                    </div>
                  </td>

                  {/* Net Amount with Discount Pill if applicable */}
                  <td>
                    <div className="col gap-1">
                      <b className="text-base" style={{ color: fee.status === 'Unpaid' ? '#ef4444' : 'var(--text-primary)' }}>
                        EGP {fee.finalAmount.toLocaleString()}
                      </b>
                      {fee.discount > 0 && (
                        <span className="text-xs" style={{ color: '#0ea5e9' }}>
                          Saved EGP {fee.discount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date (Settled or Due) */}
                  <td>
                    <div className="text-xs">
                      <span className="muted block">{fee.status === 'Paid' ? 'Paid on' : 'Due date'}</span>
                      <b>{fee.status === 'Paid' ? (fee.paymentDate || fee.dueDate) : fee.dueDate}</b>
                    </div>
                  </td>

                  {/* Clean Status Badge (Zero Green) */}
                  <td>
                    <span
                      className={`badge no-dot ${
                        fee.status === 'Paid'
                          ? 'b-primary'
                          : 'b-danger'
                      }`}
                      style={{ fontWeight: 650 }}
                    >
                      {fee.status}
                    </span>
                  </td>

                  {/* Clean Action Button */}
                  <td className="text-right">
                    {fee.status === 'Unpaid' ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setPayingFee(fee);
                          setPaymentState('pending');
                        }}
                      >
                        <Icon name="creditCard" size="sm" /> Pay Fawry
                      </button>
                    ) : (
                      <a
                        href={`#/student/receipts/${fee.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Icon name="receipt" size="sm" /> View Receipt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fawry Payment Gateway Modal */}
      {payingFee && (
        <Modal
          isOpen={!!payingFee}
          onClose={() => setPayingFee(null)}
          title="Fawry Payment Gateway"
          subtitle="Official electronic collection for Beni Suef University"
          iconName="creditCard"
          tone="info"
          footer={
            paymentState === 'paid' ? (
              <a
                href={`#/student/receipts/${payingFee.id}`}
                className="btn btn-primary"
                onClick={() => setPayingFee(null)}
              >
                View Official Digital Receipt
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPayingFee(null)}
                disabled={paymentState === 'processing'}
              >
                Close
              </button>
            )
          }
        >
          <div className="col gap-4">
            <div className="info-tile">
              <small>Tuition Fee Particulars</small>
              <b>{payingFee.feeType}</b>
              <div className="row-between mt-2">
                <span className="muted">Net Due Amount:</span>
                <b className="text-lg text-primary">EGP {payingFee.finalAmount.toLocaleString()}</b>
              </div>
            </div>

            {paymentState === 'pending' && (
              <div className="col gap-3">
                <p className="text-xs muted">
                  You are about to initiate an electronic payment through Fawry. You can pay using your debit/credit card or via FawryPay reference code at any retail kiosk in Egypt.
                </p>
                <div className="radio-card selected">
                  <div style={{ flex: 1 }}>
                    <b>Instant Fawry Online Debit / Credit Card</b>
                    <span className="block text-xs muted">Immediate electronic settlement</span>
                  </div>
                  <Icon name="checkCircle" size="sm" className="trend-up" />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block mt-2"
                  onClick={handleStartFawryPayment}
                >
                  Confirm &amp; Pay EGP {payingFee.finalAmount.toLocaleString()}
                </button>
              </div>
            )}

            {paymentState === 'processing' && (
              <div className="state py-6">
                <div className="spinner lg mb-3" />
                <h3>Verifying Transaction with Fawry…</h3>
                <p className="text-xs muted">
                  Your payment is currently being verified through the banking network. Please do not refresh.
                </p>
              </div>
            )}

            {paymentState === 'paid' && (
              <div className="state py-4">
                <div className="state-art info mb-2"><Icon name="checkCircle" size="xl" /></div>
                <h3>Payment Successfully Verified!</h3>
                <p className="text-xs muted">
                  Fawry Gateway confirmed settlement. Transaction Ref: <b className="mono text-primary">{transactionRef}</b>
                </p>
              </div>
            )}

            {paymentState === 'failed' && (
              <div className="state py-4">
                <div className="state-art danger mb-2"><Icon name="xCircle" size="xl" /></div>
                <h3>Transaction Declined</h3>
                <p className="text-xs muted">Fawry provider was unable to authorize the charge. Please verify card funds and retry.</p>
                <button type="button" className="btn btn-primary mt-3" onClick={() => setPaymentState('pending')}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
