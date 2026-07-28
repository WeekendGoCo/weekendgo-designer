import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../../../lib/db';

export default function DistancesSection({ tripData, updateTripData }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(db.getCountries());
  }, []);

  const tripCities = countries.find(c => c.name === tripData.country)?.cities || [];
  const addDistance = () => {
    updateTripData(prev => ({
      ...prev,
      distances: [...(prev.distances || []), { id: uuidv4(), city1: '', city2: '', km: '', hours: '' }]
    }));
  };

  const updateDistance = (id, field, value) => {
    updateTripData(prev => ({
      ...prev,
      distances: prev.distances.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const removeDistance = (id) => {
    updateTripData(prev => ({
      ...prev,
      distances: prev.distances.filter(d => d.id !== id)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>المسافات بين المدن (بري)</h3>
        <button onClick={addDistance} style={addBtnStyle}><Plus size={14} /> أضف مسافة</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tripCities.length === 0 && (
          <div style={{ fontSize: '11px', color: '#ffa500', marginBottom: '10px' }}>⚠️ اختر دولة الرحلة ومدنها أولاً من قسم المعلومات الأساسية.</div>
        )}
        {tripData.distances?.map((dist) => (
          <div key={dist.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={dist.city1}
              onChange={e => updateDistance(dist.id, 'city1', e.target.value)}
              style={inputStyle}
            >
              <option value="" style={{ color: '#000' }}>— مدينة 1 —</option>
              {tripCities.map(city => (
                <option key={city.id} value={city.name} style={{ color: '#000' }}>{city.name}</option>
              ))}
            </select>
            <select
              value={dist.city2}
              onChange={e => updateDistance(dist.id, 'city2', e.target.value)}
              style={inputStyle}
            >
              <option value="" style={{ color: '#000' }}>— مدينة 2 —</option>
              {tripCities.map(city => (
                <option key={city.id} value={city.name} style={{ color: '#000' }}>{city.name}</option>
              ))}
            </select>
            <input 
              placeholder="المسافة بالـ كم" 
              type="number"
              value={dist.km} 
              onChange={e => updateDistance(dist.id, 'km', e.target.value)}
              style={{ ...inputStyle, width: '60px' }}
            />
            <input 
              placeholder="المدة (ساعة)" 
              type="number" step="0.5"
              value={dist.hours} 
              onChange={e => updateDistance(dist.id, 'hours', e.target.value)}
              style={{ ...inputStyle, width: '60px' }}
            />
            <button onClick={() => removeDistance(dist.id)} style={delBtnStyle}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!tripData.distances || tripData.distances.length === 0) && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>لا توجد مسافات مضافة.</div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
  borderRadius: '6px', padding: '8px 10px', color: 'var(--text-main)', fontSize: '12px',
  outline: 'none', width: '100%'
};

const addBtnStyle = {
  background: 'rgba(140, 198, 63, 0.15)', color: 'var(--g)', border: '1px solid var(--g)',
  padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
  display: 'flex', alignItems: 'center', gap: '4px'
};

const delBtnStyle = {
  background: 'rgba(255, 80, 80, 0.15)', color: '#ff5050', padding: '8px', borderRadius: '6px'
};
