"use client";

import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Home() {
  const [trips, setTrips] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setTrips(db.getTrips());
  }, []);

  const handleCreate = () => {
    const newTrip = db.saveTrip(null, 'رحلة جديدة');
    router.push(`/designer?id=${newTrip.id}`);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      db.deleteTrip(id);
      setTrips(db.getTrips());
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ne)' }}>الرحلات المحفوظة</h1>
        <button 
          onClick={handleCreate}
          style={{ 
            background: 'var(--g)', color: 'var(--n)', padding: '12px 24px', 
            borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: '700', boxShadow: 'var(--gg)'
          }}
        >
          <Plus size={20} />
          إنشاء رحلة جديدة
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {trips.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted-dark)' }}>
            لا توجد رحلات محفوظة بعد.
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{trip.name}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)' }}>
                  آخر تعديل: {new Date(trip.updatedAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => router.push(`/designer?id=${trip.id}`)}
                  style={{ background: 'rgba(0, 173, 239, 0.15)', color: 'var(--ne)', padding: '8px', borderRadius: '8px' }}
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(trip.id)}
                  style={{ background: 'rgba(255, 80, 80, 0.15)', color: '#ff5050', padding: '8px', borderRadius: '8px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
