import React, { useEffect, useState } from 'react';
import { fakeApi } from '../../services/fakeApi';
import { PageHead } from '../../components/layout/Breadcrumbs';
import { Icon } from '../../components/icons/Icon';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import type { Room } from '../../types';

export const AdminRooms: React.FC = () => {
  const { showToast } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Hall' | 'Lab'>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fakeApi.getAdminRooms().then(res => {
      setRooms(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <CardSkeleton count={4} />;

  const filtered = rooms.filter(r => typeFilter === 'All' || r.type === typeFilter);

  return (
    <div>
      <PageHead
        title="Rooms, Lecture Halls &amp; AI Labs"
        subtitle="Manage physical infrastructure, capacities, equipment inventory, and interactive floor positioning"
        breadcrumbs={[
          { label: 'College Admin', href: '#/admin/dashboard' },
          { label: 'Rooms & Labs' }
        ]}
        actions={
          <button className="btn btn-primary" onClick={() => showToast('New room creation modal', 'info')}>
            <Icon name="plus" /> Add Hall or Lab
          </button>
        }
      />

      {/* Filter Row */}
      <div className="card p-4 mb-5">
        <div className="row-between wrap gap-2">
          <div className="row gap-2">
            <button
              className={`btn btn-sm ${typeFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('All')}
            >
              All Spaces ({rooms.length})
            </button>
            <button
              className={`btn btn-sm ${typeFilter === 'Hall' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('Hall')}
            >
              Lecture Halls
            </button>
            <button
              className={`btn btn-sm ${typeFilter === 'Lab' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTypeFilter('Lab')}
            >
              Computer &amp; AI Labs
            </button>
          </div>
          <div className="chip chip-info">Faculty Main Building</div>
        </div>
      </div>

      <div className="grid g-3">
        {/* Rooms List */}
        <div className="col-span-2">
          <div className="grid g-2">
            {filtered.map(room => (
              <div
                key={room.id}
                className="card p-5 hover"
                style={{
                  cursor: 'pointer',
                  border: selectedRoom?.id === room.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                }}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="row-between mb-2">
                  <span className={`badge ${room.type === 'Hall' ? 'badge-primary' : 'badge-info'}`}>
                    {room.type === 'Hall' ? 'Lecture Hall' : 'Practical Lab'}
                  </span>
                  <span className="badge badge-success">Capacity: {room.capacity} Seats</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{room.name}</h3>
                <p className="sub text-xs mb-3">{room.building} · {room.floor}</p>
                <div className="row gap-1 wrap mb-3">
                  {room.equipment?.map((eq: string, idx: number) => (
                    <span key={idx} className="chip chip-neutral" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {eq}
                    </span>
                  ))}
                </div>
                <div className="row-between text-xs sub border-t pt-2">
                  <span>Coordinates: ({room.mapCoordinates?.x ?? 0}, {room.mapCoordinates?.y ?? 0})</span>
                  <span className="bold text-primary">Click to highlight on map &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Floor Map Visualization */}
        <div>
          <div className="card p-5" style={{ position: 'sticky', top: '90px' }}>
            <div className="card-head">
              <h4>Interactive Floor Map</h4>
              <span className="badge badge-neutral">Ground &amp; 1st Floor</span>
            </div>
            <div
              className="p-4 my-3 rounded"
              style={{
                background: 'var(--color-bg-page)',
                border: '1px solid var(--color-border)',
                minHeight: '260px',
                position: 'relative'
              }}
            >
              <svg width="100%" height="220" viewBox="0 0 200 120" fill="none">
                {/* Floor Blueprint Outline */}
                <rect x="10" y="10" width="180" height="100" rx="4" fill="#ffffff" stroke="#5483B3" strokeWidth="2" strokeDasharray="2 2" />
                <line x1="10" y1="60" x2="190" y2="60" stroke="#7DA0CA" strokeWidth="1" />
                <line x1="100" y1="10" x2="100" y2="110" stroke="#7DA0CA" strokeWidth="1" />

                {/* Rooms Points */}
                {rooms.map(r => {
                  const isSel = selectedRoom?.id === r.id;
                  return (
                    <g key={r.id} onClick={() => setSelectedRoom(r)} style={{ cursor: 'pointer' }}>
                      <circle
                        cx={r.mapCoordinates?.x ?? 50}
                        cy={r.mapCoordinates?.y ?? 50}
                        r={isSel ? 9 : 6}
                        fill={isSel ? 'var(--color-primary)' : r.type === 'Hall' ? '#052659' : '#5483B3'}
                      />
                      <text
                        x={r.mapCoordinates?.x ?? 50}
                        y={(r.mapCoordinates?.y ?? 50) + 16}
                        fontSize="8"
                        textAnchor="middle"
                        fill="#021024"
                        fontWeight={isSel ? 'bold' : 'normal'}
                      >
                        {r.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {selectedRoom ? (
              <div className="card p-3" style={{ background: '#f8fafc', fontSize: '12px' }}>
                <div className="bold mb-1">{selectedRoom.name}</div>
                <div className="sub mb-1">Building: {selectedRoom.building} ({selectedRoom.floor})</div>
                <div>Capacity: <strong>{selectedRoom.capacity} students</strong></div>
              </div>
            ) : (
              <p className="sub text-xs text-center">Click any hall or lab to preview its blueprint coordinates</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
