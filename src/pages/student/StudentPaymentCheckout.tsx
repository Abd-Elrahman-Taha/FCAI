import React, { useState } from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const StudentPaymentCheckout: React.FC = () => {
  const { showToast } = useAuth();
  const [provider, setProvider] = useState<'fawry' | 'visa' | 'meeza'>('fawry');

  const feeItems = [
    { name: 'Standard Academic Tuition (Fall 2026)', amount: 6500 },
    { name: 'Technology & AI Labs Access Fee', amount: 800 },
    { name: 'Student Union & Institutional Activities', amount: 350 }
  ];

  const subtotal = 7650;
  const discount = 0; // Excellence scholarship discount
  const grandTotal = subtotal - discount;

  const handleProceed = () => {
    showToast('Redirecting to verified payment gateway...', 'info');
    window.location.hash = '#/student/payment-result';
  };

  return (
    <div>
      <PageHead
        title="Screen 32: Payment Checkout &amp; Settlement"
        subtitle="Review outstanding fee invoices, apply institutional discounts, and select electronic payment provider"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Outstanding Fees', href: '#/student/fees' },
          { label: 'Payment Checkout' }
        ]}
      />

      <div className="grid g-3 mb-6" style={{ maxWidth: '880px' }}>
        <div className="col-span-2">
          {/* Selected Invoices */}
          <div className="card p-5 mb-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Selected Fee Obligations</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fee Description</th>
                    <th>Term</th>
                    <th className="text-right">Amount (EGP)</th>
                  </tr>
                </thead>
                <tbody>
                  {feeItems.map(f => (
                    <tr key={f.name}>
                      <td className="bold">{f.name}</td>
                      <td>Fall 2026</td>
                      <td className="text-right bold">{f.amount.toLocaleString()} EGP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Provider Selection */}
          <div className="card p-5">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Select Payment Provider</h3>
            <div className="grid g-3">
              <div
                className={`card p-4 hover border ${provider === 'fawry' ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer', background: provider === 'fawry' ? 'var(--color-bg-subtle)' : '#fff' }}
                onClick={() => setProvider('fawry')}
              >
                <div className="row-between mb-2">
                  <strong className="text-sm">Fawry Electronic Network</strong>
                  <span className="badge badge-warning">Instant Code</span>
                </div>
                <p className="sub text-xs">Pay at any Fawry retail point or through myFawry mobile app using a reference code.</p>
              </div>

              <div
                className={`card p-4 hover border ${provider === 'meeza' ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer', background: provider === 'meeza' ? 'var(--color-bg-subtle)' : '#fff' }}
                onClick={() => setProvider('meeza')}
              >
                <div className="row-between mb-2">
                  <strong className="text-sm">Meeza National Debit Card</strong>
                  <span className="badge badge-primary">Direct Bank</span>
                </div>
                <p className="sub text-xs">Egyptian national payment gateway for cards issued by Egyptian banks.</p>
              </div>

              <div
                className={`card p-4 hover border ${provider === 'visa' ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer', background: provider === 'visa' ? 'var(--color-bg-subtle)' : '#fff' }}
                onClick={() => setProvider('visa')}
              >
                <div className="row-between mb-2">
                  <strong className="text-sm">Visa / Mastercard</strong>
                  <span className="badge badge-neutral">Credit / Debit</span>
                </div>
                <p className="sub text-xs">International or local bank credit/debit card secure checkout.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Order Summary Card */}
          <div className="card p-5" style={{ position: 'sticky', top: '90px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Checkout Summary</h4>
            <div className="stack gap-2 text-sm mb-4">
              <div className="row-between">
                <span className="sub">Subtotal Amount:</span>
                <strong>{subtotal.toLocaleString()} EGP</strong>
              </div>
              <div className="row-between">
                <span className="sub">Excellence Discount:</span>
                <span className="text-success bold">- 0.00 EGP</span>
              </div>
              <div className="row-between pt-2 border-t text-base">
                <strong style={{ fontSize: '16px' }}>Total Due:</strong>
                <strong style={{ fontSize: '20px', color: 'var(--color-primary)' }}>
                  {grandTotal.toLocaleString()} EGP
                </strong>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={handleProceed}>
              <Icon name="checkCircle" /> Proceed to Secure Gateway &rarr;
            </button>
            <div className="sub text-xs text-center mt-3">
              Official Fawry gateway verified by BSU Treasury
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
