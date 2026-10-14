import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const StudentPaymentResult: React.FC = () => {
  const { showToast } = useAuth();
  // State: 'processing' -> 'verifying_backend' -> 'success'
  const [stage, setStage] = useState<'processing' | 'verifying_backend' | 'success'>('processing');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // 1. Initial gateway return simulation
    const timer1 = setTimeout(() => {
      setStage('verifying_backend');
    }, 1200);

    // 2. Mandatory backend provider webhook reconciliation
    const timer2 = setTimeout(async () => {
      const res = await fakeApi.payFeeFawry('fee_fall_2026_tuition');
      setPaymentData(res);
      setStage('success');
      showToast('Payment verified and reconciled by faculty financial server!', 'success');
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [showToast]);

  return (
    <div>
      <PageHead
        title="Screen 33: Payment Processing &amp; Verification State"
        subtitle="Gateway handshake, transaction confirmation, and backend institutional reconciliation"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Fees', href: '#/student/fees' },
          { label: 'Payment State' }
        ]}
      />

      <div className="card p-8 text-center mb-6" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {stage === 'processing' && (
          <div>
            <div className="icon-pulse mb-4 text-primary">
              <Icon name="clock" size="xl" className="mx-auto" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 750, marginBottom: '8px' }}>
              Handshaking with Payment Gateway...
            </h2>
            <p className="sub text-sm">
              Connecting to the secure financial network. Please do not close or refresh this browser tab.
            </p>
          </div>
        )}

        {stage === 'verifying_backend' && (
          <div>
            <div className="icon-pulse mb-4 text-info">
              <Icon name="shield" size="xl" className="mx-auto" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 750, marginBottom: '8px' }}>
              Verifying Provider Settlement With Faculty Server...
            </h2>
            <div className="alert alert-info text-left text-xs mb-4">
              <Icon name="info" />
              <div>
                <strong>Financial Compliance Rule:</strong> Payments are never finalized in the browser alone. Our backend is performing mutual cryptographic verification against Fawry gateway webhooks.
              </div>
            </div>
          </div>
        )}

        {stage === 'success' && paymentData && (
          <div>
            <div className="p-3 mb-4 rounded-full bg-green-50 inline-block">
              <Icon name="checkCircle" size="xl" style={{ color: 'var(--color-success)' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
              Payment Officially Reconciled &amp; Verified!
            </h2>
            <p className="sub text-xs mb-5">
              The transaction has been settled into Beni Suef University accounts and your registration hold is cleared.
            </p>

            <div className="card p-4 text-left mb-5" style={{ background: 'var(--color-bg-page)' }}>
              <div className="row-between text-xs pb-2 border-b mb-2">
                <span className="sub">Provider Reference:</span>
                <code className="bold text-primary">{paymentData.transactionRef}</code>
              </div>
              <div className="row-between text-xs pb-2 border-b mb-2">
                <span className="sub">Settlement Date:</span>
                <strong>{paymentData.paymentDate}</strong>
              </div>
              <div className="row-between text-xs pb-2 border-b mb-2">
                <span className="sub">Amount Settled:</span>
                <strong>7,650 EGP</strong>
              </div>
              <div className="row-between text-xs">
                <span className="sub">Status:</span>
                <span className="badge badge-success">Official Reconciled</span>
              </div>
            </div>

            <div className="row-center gap-2">
              <a href="#/student/receipt" className="btn btn-primary">
                <Icon name="download" /> View &amp; Print Official Digital Receipt
              </a>
              <a href="#/student/fees" className="btn btn-secondary">
                Return to Fees
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
