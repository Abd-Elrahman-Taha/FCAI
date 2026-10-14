import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon, FCAILogo } from '../../components/icons/Icon';
import type { Receipt } from '../../types';

export const StudentReceipt: React.FC<{ receiptId?: string }> = ({ receiptId }) => {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApi.getReceipt(receiptId || 'f2').then(res => {
      setReceipt(res);
      setLoading(false);
    });
  }, [receiptId]);

  if (loading || !receipt) return <div className="card card-pad"><div className="spinner lg mx-auto" /></div>;

  return (
    <div>
      <PageHead
        title="Official Digital Receipt"
        desc="Dean &amp; Comptroller verified digital receipt for university tuition settlement."
        crumbs={[['Student Portal', '#/student/dashboard'], ['Fees', '#/student/fees'], ['Receipt']]}
        actions={
          <div className="row gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              <Icon name="printer" /> Print Official Receipt
            </button>
            <a
              href="#/student/fees"
              className="btn btn-primary"
            >
              <Icon name="arrowLeft" /> Back to Financial Dashboard
            </a>
          </div>
        }
      />

      {/* Printable Receipt Certificate Layout */}
      <div className="row" style={{ justifyContent: 'center' }}>
        <div
          className="card card-pad"
          style={{
            maxWidth: '680px',
            width: '100%',
            background: '#fff',
            boxShadow: 'var(--sh-lg)',
            border: '2px solid var(--border-strong)',
            padding: '36px'
          }}
        >
          {/* Official University Header */}
          <div className="row-between mb-6 pb-6" style={{ borderBottom: '2px solid var(--navy-800)' }}>
            <div className="row gap-3">
              <FCAILogo size={52} />
              <div>
                <b style={{ fontSize: '18px', color: 'var(--navy-950)', display: 'block' }}>
                  Beni Suef University · FCAI
                </b>
                <span style={{ fontSize: '12.5px', color: 'var(--gray-700)', fontWeight: 500 }}>
                  Faculty of Computers and Artificial Intelligence
                </span>
                <span className="text-xs muted block">Comptroller &amp; Financial Affairs Unit</span>
              </div>
            </div>

            <div className="text-right">
              <span className="badge b-success no-dot mb-1">Electronic Payment Reconciled</span>
              <div className="text-xs muted">Receipt No:</div>
              <b className="mono text-sm">{receipt.receiptNumber}</b>
            </div>
          </div>

          {/* Student Particulars */}
          <div className="grid g-2 text-xs mb-6">
            <div className="col gap-1">
              <span className="muted">Student Name:</span>
              <b style={{ fontSize: '14px' }}>{receipt.studentName}</b>
              <span className="muted mt-1">Student Code:</span>
              <span className="mono fw-6">{receipt.studentCode}</span>
            </div>
            <div className="col gap-1 text-right">
              <span className="muted">National Identification No:</span>
              <span className="mono fw-6">{receipt.nationalId}</span>
              <span className="muted mt-1">Department:</span>
              <span className="fw-6">{receipt.department}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="table mb-6" style={{ border: '1px solid var(--border)' }}>
            <thead>
              <tr>
                <th>Description / Purpose</th>
                <th>Currency</th>
                <th className="text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>{receipt.feeType}</b>
                  <div className="text-xs muted">Electronic settlement collected through {receipt.paymentMethod}</div>
                </td>
                <td>{receipt.currency}</td>
                <td className="text-right">
                  <b className="text-lg text-primary">{receipt.amount.toLocaleString()}</b>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-right fw-7" style={{ background: 'var(--surface-2)' }}>Total Reconciled Paid:</td>
                <td className="text-right fw-7 text-primary" style={{ background: 'var(--surface-2)', fontSize: '16px' }}>
                  {receipt.currency} {receipt.amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification Stamps */}
          <div className="row-between pt-4 text-xs muted" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <span>Settlement Date: <b>{receipt.paymentDate}</b></span>
              <br />
              <span>Provider: <b>{receipt.paymentMethod}</b></span>
            </div>
            <div className="text-right">
              <span className="badge b-navy no-dot mb-1">Official Digital Signature</span>
              <div className="text-xs faint">Verification Code: SHA256-BSU-{receipt.studentCode}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
