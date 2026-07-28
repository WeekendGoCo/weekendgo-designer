import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

export default function FlightsSection({ tripData, updateTripData }) {
  const addFlight = () => {
    updateTripData(prev => ({
      ...prev,
      flights: [...(prev.flights || []), { id: uuidv4(), city1: '', city2: '', km: '', duration: '' }]
    }));
  };

  const updateFlight = (id, field, value) => {
    updateTripData(prev => ({
      ...prev,
      flights: prev.flights.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const removeFlight = (id) => {
    updateTripData(prev => ({
      ...prev,
      flights: prev.flights.filter(d => d.id !== id)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>الطيران الداخلي ✈</h3>
        <button onClick={addFlight} style={addBtnStyle}><Plus size={14} /> أضف رحلة</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tripData.flights?.map((flight) => (
          <div key={flight.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              placeholder="مدينة 1" 
              value={flight.city1} 
              onChange={e => updateFlight(flight.id, 'city1', e.target.value)}
              style={inputStyle}
            />
            <input 
              placeholder="مدينة 2" 
              value={flight.city2} 
              onChange={e => updateFlight(flight.id, 'city2', e.target.value)}
              style={inputStyle}
            />
            <input 
              placeholder="المسافة (كم)" 
              value={flight.km} 
              onChange={e => updateFlight(flight.id, 'km', e.target.value)}
              style={{ ...inputStyle, width: '60px' }}
            />
            <input 
              placeholder="المدة (س)" 
              value={flight.duration} 
              onChange={e => updateFlight(flight.id, 'duration', e.target.value)}
              style={{ ...inputStyle, width: '60px' }}
            />
            <button onClick={() => removeFlight(flight.id)} style={delBtnStyle}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!tripData.flights || tripData.flights.length === 0) && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>لا توجد رحلات داخلية مضافة.</div>
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
