import React from 'react';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';

export const StudentPaymentHistory: React.FC = () => {
  const transactions = [
    { date: 'Oct 08, 2026', feeType: 'Standard Tuition (Fall 2026)', amount: 6500, ref: 'FWY-98214412', provider: 'Fawry Electronic', status: 'Reconciled' },
    { date: 'Oct 08, 2026', feeType: 'Technology & AI Labs Access Fee', amount: 800, ref: 'FWY-98214413', provider: 'Fawry Electronic', status: 'Reconciled' },
    { date: 'Oct 08, 2026', feeType: 'Student Union & Activities Fee', amount: 350, ref: 'FWY-98214414', provider: 'Fawry Electronic', status: 'Reconciled' },
    { date: 'Feb 12, 2026', feeType: 'Standard Tuition (Spring 2026)', amount: 6500, ref: 'FWY-74829103', provider: 'Meeza National Debit', status: 'Reconciled' },
    { date: 'Oct 05, 2025', feeType: 'Standard Tuition (Fall 2025)', amount: 6000, ref: 'FWY-55192834', provider: 'Fawry Electronic', status: 'Reconciled' }
  ];

  return (
    <div>
      <PageHead
        title="Screen 34: Payment Transaction History"
        subtitle="Archival ledger of all reconciled tuition payments, provider references, and printable receipts"
        breadcrumbs={[
          { label: 'Student Portal', href: '#/student/dashboard' },
          { label: 'Fees', href: '#/student/fees' },
          { label: 'Payment History' }
        ]}
      />

      <div className="card">
        <div className="card-head">
          <h3>Settled Financial Transactions</h3>
          <span className="badge badge-success">All Transactions Reconciled</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Payment Date</th>
                <th>Fee Obligation</th>
                <th>Provider &amp; Gateway</th>
                <th>Transaction Ref</th>
                <th>Settled Amount</th>
                <th>Status</th>
                <th>Digital Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.ref}>
                  <td className="sub text-xs">{tx.date}</td>
                  <td className="bold">{tx.feeType}</td>
                  <td>{tx.provider}</td>
                  <td><code>{tx.ref}</code></td>
                  <td className="bold" style={{ color: 'var(--color-primary)' }}>{tx.amount.toLocaleString()} EGP</td>
                  <td><span className="badge badge-success">{tx.status}</span></td>
                  <td>
                    <a href="#/student/receipt" className="btn btn-secondary btn-sm">
                      <Icon name="download" /> Receipt
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
