import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminIntegrations: React.FC = () => {
  const { showToast } = useAuth();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    fakeApi.getSuperAdminIntegrations().then(res => {
      setIntegrations(res);
      setLoading(false);
    });
  }, []);

  const handlePing = async (id: string, name: string) => {
    setTestingId(id);
    await new Promise(r => setTimeout(r, 500));
    setTestingId(null);
    showToast(`Health check ping to ${name} returned 200 OK.`, 'success');
  };

  if (loading) return <CardSkeleton count={4} />;

  return (
    <div>
      <PageHead
        title="Screen 105: Enterprise Integration Middleware & API Connectors"
        subtitle="Monitor external upstream connections: payment gateways, central university SIS, AI services, and SMS"
        breadcrumbs={[
          { label: 'System Admin', href: '#/superadmin/system-config' },
          { label: 'Screen 105: Integrations' }
        ]}
        actions={
          <div className="row gap-2">
            <a href="#/superadmin/audit-logs" className="btn btn-secondary">
              <Icon name="file" /> Immutable Audit Log (Screen 106)
            </a>
            <button className="btn btn-primary" onClick={() => showToast('All 4 external microservices verified healthy.', 'success')}>
              <Icon name="refresh" /> Test All Integrations
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid g-4 mb-4">
        <div className="card p-3">
          <div className="text-xs sub bold">Connected Services</div>
          <div className="h3 bold text-primary mt-1">{integrations.length} <span className="text-xs sub">Gateways</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">System Health Status</div>
          <div className="h3 bold text-success mt-1">100% Operational</div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Average Latency</div>
          <div className="h3 bold text-info mt-1">78ms <span className="text-xs sub">Roundtrip</span></div>
        </div>
        <div className="card p-3">
          <div className="text-xs sub bold">Webhook Security</div>
          <div className="h3 bold text-neutral mt-1">HMAC-SHA256</div>
        </div>
      </div>

      {/* Integrations Cards */}
      <div className="grid g-2">
        {integrations.map(int => (
          <div key={int.id} className="card p-4">
            <div className="row-between mb-2">
              <span className="badge badge-primary">{int.id}</span>
              <span className="badge badge-success">● {int.status}</span>
            </div>

            <h3 className="mb-2">{int.name}</h3>

            <div className="stack gap-2 text-xs mb-4">
              <div className="row-between py-1 border-b">
                <span className="sub">API Endpoint:</span>
                <code className="text-xs">{int.endpoint}</code>
              </div>
              <div className="row-between py-1 border-b">
                <span className="sub">Gateway Latency:</span>
                <strong className="text-success">{int.latency}</strong>
              </div>
              <div className="row-between py-1">
                <span className="sub">Last Synchronized:</span>
                <span>{int.lastSync}</span>
              </div>
            </div>

            <div className="row-between gap-2 pt-3 border-t">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => showToast(`Opening webhook parameters for ${int.name}`, 'info')}
              >
                <Icon name="settings" size="sm" /> Configure
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handlePing(int.id, int.name)}
                disabled={testingId === int.id}
              >
                <Icon name="refresh" size="sm" /> {testingId === int.id ? 'Pinging...' : 'Ping Test'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
