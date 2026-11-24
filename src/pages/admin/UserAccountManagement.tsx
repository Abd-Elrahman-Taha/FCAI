/**
 * Screen 7: Admin Accounts Management (Admin)
 *
 * Connected strictly to all 7 confirmed Swagger AdminAdmins endpoints:
 * - GET  /api/admin/admins
 * - POST /api/admin/admins
 * - GET  /api/admin/admins/{id}
 * - PUT  /api/admin/admins/{id}
 * - POST /api/admin/admins/{id}/activate
 * - POST /api/admin/admins/{id}/deactivate
 * - POST /api/admin/admins/{id}/reset-password
 */

import React, { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type { AdminDetailDto, AdminListItemDto, PaginationMetadata } from '../../types/api';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';

export const UserAccountManagement: React.FC = () => {
  const { showToast } = useAuth();

  const [items, setItems] = useState<AdminListItemDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminDetailDto | null>(null);

  // Create / Edit modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fullNameEn, setFullNameEn] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset Password modal
  const [resetTarget, setResetTarget] = useState<AdminListItemDto | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const loadAdmins = useCallback(
    async (page = pageIndex, search = searchTerm, active = activeFilter) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.people.admins.list({
          PageIndex: page,
          PageSize: 15,
          SearchTerm: search.trim() || undefined,
          IsActive: active === '' ? undefined : active === 'true',
        });
        setItems(res.items ?? []);
        setMeta(res.meta ?? null);
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load admin accounts.');
      } finally {
        setLoading(false);
      }
    },
    [pageIndex, searchTerm, activeFilter]
  );

  useEffect(() => {
    let cancelled = false;
    api.people.admins
      .list({ PageIndex: 1, PageSize: 15 })
      .then(res => {
        if (cancelled) return;
        setItems(res.items ?? []);
        setMeta(res.meta ?? null);
        setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load admin accounts.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFullNameEn('');
    setFullNameAr('');
    setEmail('');
    setUsername('');
    setPhoneNumber('');
    setPassword('');
    setFormError(null);
  };

  const openEdit = async (id: number) => {
    setBusyId(id);
    setFormError(null);
    try {
      const fresh = await api.people.admins.getById(id);
      setEditingId(fresh.id);
      setFullNameEn(fresh.fullNameEn ?? '');
      setFullNameAr(fresh.fullNameAr ?? '');
      setEmail(fresh.email ?? '');
      setUsername(fresh.username ?? '');
      setPhoneNumber(fresh.phoneNumber ?? '');
      setPassword('');
      setModalMode('edit');
    } catch (err: unknown) {
      showToast('Load Failed', err instanceof Error ? err.message : 'Could not load admin.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!fullNameEn.trim() || !email.trim()) {
      setFormError('English full name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await api.people.admins.create({
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          email: email.trim(),
          username: username.trim() || null,
          phoneNumber: phoneNumber.trim() || null,
          password: password || null,
        });
        showToast('Admin Created', res.message, 'success');
      } else if (modalMode === 'edit' && editingId !== null) {
        const res = await api.people.admins.update(editingId, {
          fullNameEn: fullNameEn.trim(),
          fullNameAr: fullNameAr.trim() || null,
          email: email.trim(),
          username: username.trim() || null,
          phoneNumber: phoneNumber.trim() || null,
        });
        showToast('Admin Updated', res.message, 'success');
      }
      setModalMode(null);
      await loadAdmins(pageIndex);
    } catch (err: unknown) {
      setFormError(err instanceof ApiError || err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: AdminListItemDto) => {
    setBusyId(item.id);
    try {
      const msg = item.isActive
        ? await api.people.admins.deactivate(item.id)
        : await api.people.admins.activate(item.id);
      showToast(item.isActive ? 'Admin Deactivated' : 'Admin Activated', msg, 'success');
      await loadAdmins(pageIndex);
    } catch (err: unknown) {
      showToast('Action Failed', err instanceof Error ? err.message : 'Status update failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget || !newPassword) return;
    setResetting(true);
    try {
      const msg = await api.people.admins.resetPassword(resetTarget.id, { newPassword });
      showToast('Password Reset', msg, 'success');
      setResetTarget(null);
      setNewPassword('');
    } catch (err: unknown) {
      showToast('Reset Failed', err instanceof Error ? err.message : 'Password reset failed.', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHead
        crumbs={[
          { label: 'Admin', href: '#/admin/dashboard' },
          { label: 'People' },
          { label: 'Admin Accounts' },
        ]}
        title="Administrator Accounts"
        subtitle="Manage college administrator accounts, activation status, and administrative password resets."
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size="sm" /> Create Admin
          </button>
        }
      />

      <div className="card card-pad">
        <form
          onSubmit={e => {
            e.preventDefault();
            setPageIndex(1);
            void loadAdmins(1, searchTerm, activeFilter);
          }}
          className="flex flex-wrap gap-3 items-center"
        >
          <input
            className="input flex-1"
            style={{ minWidth: '220px' }}
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            style={{ width: 'auto' }}
            value={activeFilter}
            onChange={e => {
              setActiveFilter(e.target.value);
              setPageIndex(1);
              void loadAdmins(1, searchTerm, e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Filter</button>
        </form>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : loadError ? (
        <div className="card card-pad state">
          <div className="state-art danger"><Icon name="alert" size="lg" /></div>
          <h3>Failed to load admins</h3>
          <p className="text-sm muted">{loadError}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card card-pad state">
          <div className="state-art"><Icon name="shield" size="lg" /></div>
          <h3>No Administrator Accounts Found</h3>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Username / Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="font-semibold">{a.fullNameEn || '—'}</div>
                    {a.fullNameAr && <div className="text-xs muted">{a.fullNameAr}</div>}
                  </td>
                  <td className="text-sm">
                    <div className="font-mono text-xs">{a.username || '—'}</div>
                    <div className="text-xs muted">{a.email}</div>
                  </td>
                  <td className="text-xs font-mono">{a.phoneNumber || '—'}</td>
                  <td>
                    <span className={a.isActive ? 'chip chip-primary' : 'chip chip-danger'}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-xs muted">{a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString() : 'Never'}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => void api.people.admins.getById(a.id).then(setDetail)}>View</button>
                      <button type="button" className="btn btn-outline btn-xs" disabled={busyId === a.id} onClick={() => void openEdit(a.id)}>Edit</button>
                      <button type="button" className="btn btn-outline btn-xs" onClick={() => { setResetTarget(a); setNewPassword(''); }}>Reset PW</button>
                      <button
                        type="button"
                        className={a.isActive ? 'btn btn-danger btn-xs' : 'btn btn-primary btn-xs'}
                        disabled={busyId === a.id}
                        onClick={() => void handleToggleActive(a)}
                      >
                        {a.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 text-sm">
              <span className="muted">Page {meta.pageIndex} / {meta.totalPages} ({meta.totalCount})</span>
              <div className="flex gap-2">
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasPreviousPage} onClick={() => { setPageIndex(pageIndex - 1); void loadAdmins(pageIndex - 1); }}>Previous</button>
                <button type="button" className="btn btn-outline btn-xs" disabled={!meta.hasNextPage} onClick={() => { setPageIndex(pageIndex + 1); void loadAdmins(pageIndex + 1); }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalMode === 'create' ? 'Create Administrator' : 'Edit Administrator'}</h3>
              <button type="button" className="icon-btn" onClick={() => !submitting && setModalMode(null)}><Icon name="x" size="sm" /></button>
            </div>
            {formError && <div className="alert alert-danger mb-3 text-sm">{formError}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <div><label className="label">Full Name (EN)</label><input className="input" value={fullNameEn} onChange={e => setFullNameEn(e.target.value)} required /></div>
              <div><label className="label">Full Name (AR)</label><input className="input" dir="rtl" value={fullNameAr} onChange={e => setFullNameAr(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="label">Username</label><input className="input" value={username} onChange={e => setUsername(e.target.value)} /></div>
              </div>
              <div><label className="label">Phone Number</label><input className="input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /></div>
              {modalMode === 'create' && (
                <div><label className="label">Initial Password</label><input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '420px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Reset Admin Password</h3>
              <button type="button" className="icon-btn" onClick={() => setResetTarget(null)}><Icon name="x" size="sm" /></button>
            </div>
            <p className="text-xs muted mb-3">Account: <b>{resetTarget.email}</b></p>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setResetTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={resetting}>{resetting ? 'Resetting...' : 'Reset Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card card-pad" style={{ maxWidth: '460px', width: '100%' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{detail.fullNameEn}</h3>
              <button type="button" className="icon-btn" onClick={() => setDetail(null)}><Icon name="x" size="sm" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="muted">Arabic Name</span><b>{detail.fullNameAr || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Username</span><b className="font-mono">{detail.username}</b></div>
              <div className="flex justify-between"><span className="muted">Email</span><b>{detail.email}</b></div>
              <div className="flex justify-between"><span className="muted">Phone</span><b>{detail.phoneNumber || '—'}</b></div>
              <div className="flex justify-between"><span className="muted">Created</span><span>{new Date(detail.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="muted">Last Login</span><span>{detail.lastLoginAt ? new Date(detail.lastLoginAt).toLocaleString() : 'Never'}</span></div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
