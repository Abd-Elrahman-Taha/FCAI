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
        desc="Tuition schedules, institutional fee invoices, and official Fawry payment reconciliation."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Fees & Payments']]}
      />

      {/* KPI Cards Row */}
      <div className="grid g-3 mb-6">
        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Total Outstanding Fees</span>
            <span className="kpi-ico danger"><Icon name="wallet" /></span>
          </div>
          <div className="kpi-value text-danger">EGP {unpaidTotal.toLocaleString()}</div>
          <div className="kpi-meta"><span className="trend-down">Due by October 20, 2026</span></div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Total Reconciled &amp; Paid</span>
            <span className="kpi-ico success"><Icon name="checkCircle" /></span>
          </div>
          <div className="kpi-value text-success">EGP {paidTotal.toLocaleString()}</div>
          <div className="kpi-meta">Lifetime settled university fees</div>
        </div>

        <div className="card kpi">
          <div className="kpi-top">
            <span className="kpi-label">Active Term Invoices</span>
            <span className="kpi-ico info"><Icon name="receipt" /></span>
          </div>
          <div className="kpi-value">EGP {currentSemesterTotal.toLocaleString()}</div>
          <div className="kpi-meta">Fall 2026 Academic Term</div>
        </div>
      </div>

      {/* Official Fawry Payment Notice */}
      <div className="alert alert-info mb-6">
        <Icon name="info" />
        <div>
          <b>Authorized Electronic Payment Gateway:</b>
          <p>
            All university tuition fees are collected electronically via <b>Fawry Electronic Payment Services</b>. Payments are validated in real-time with zero manual paper receipts required. Partial payments are strictly prohibited by university regulations.
          </p>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3><Icon name="receipt" size="sm" /> Student Invoices &amp; Transaction History</h3>
            <p>Inspect fee breakdowns, discounts, and digital printable receipts.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice Type</th>
                <th>Academic Term</th>
                <th>Original Amount</th>
                <th>Excellence Discount</th>
                <th>Final Due Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee: StudentFee) => (
                <tr key={fee.id}>
                  <td><b>{fee.feeType}</b></td>
                  <td><span className="badge b-info no-dot">{fee.semester}</span></td>
                  <td>EGP {fee.originalAmount.toLocaleString()}</td>
                  <td>
                    {fee.discount > 0 ? (
                      <span className="badge b-success no-dot">- EGP {fee.discount.toLocaleString()}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td><b className="text-primary">EGP {fee.finalAmount.toLocaleString()}</b></td>
                  <td>{fee.dueDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        fee.status === 'Paid'
                          ? 'b-success'
                          : fee.status === 'Unpaid'
                          ? 'b-danger'
                          : 'b-neutral'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                  <td>
                    {fee.status === 'Unpaid' ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setPayingFee(fee);
                          setPaymentState('pending');
                        }}
                      >
                        <Icon name="creditCard" size="sm" /> Pay Now via Fawry
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
                className="btn btn-secondary"
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
                <div className="state-art success mb-2"><Icon name="checkCircle" size="xl" /></div>
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
