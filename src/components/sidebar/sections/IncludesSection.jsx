import { Plus, X } from 'lucide-react';

export default function IncludesSection({ tripData, updateTripData }) {
  const addInclude = () => {
    updateTripData(prev => ({
      ...prev,
      includes: [...(prev.includes || []), { text: '', included: true }]
    }));
  };

  const updateInclude = (index, field, value) => {
    updateTripData(prev => {
      const newIncludes = [...prev.includes];
      newIncludes[index] = { ...newIncludes[index], [field]: value };
      return { ...prev, includes: newIncludes };
    });
  };

  const toggleIncluded = (index) => {
    updateTripData(prev => {
      const newIncludes = [...prev.includes];
      newIncludes[index].included = !newIncludes[index].included;
      return { ...prev, includes: newIncludes };
    });
  };

  const removeInclude = (index) => {
    updateTripData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--ne)' }}>ماذا يشمل البرنامج</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tripData.includes?.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid var(--bg-card-border)' }}>
            <button 
              onClick={() => toggleIncluded(i)}
              style={{
                background: item.included ? 'rgba(140,198,63,0.15)' : 'rgba(255,70,70,0.1)',
                border: `1px solid ${item.included ? 'rgba(140,198,63,0.3)' : 'rgba(255,70,70,0.3)'}`,
                color: item.included ? 'var(--g)' : '#ff6b6b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                minWidth: '60px'
              }}
            >
              {item.included ? 'يشمل' : 'لا يشمل'}
            </button>
            <input 
              value={item.text}
              onChange={(e) => updateInclude(i, 'text', e.target.value)}
              placeholder="وصف البند..."
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px' }}
            />
            <button onClick={() => removeInclude(i)} style={{ color: '#ff4444', padding: '4px' }}>
              <X size={16} />
            </button>
          </div>
        ))}
        
        <button onClick={addInclude} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', background: 'rgba(0,173,239,0.1)', border: '1px dashed rgba(0,173,239,0.3)', color: 'var(--ne)', borderRadius: '8px', fontSize: '13px', fontWeight: '700', marginTop: '8px' }}>
          <Plus size={16} /> إضافة بند
        </button>
      </div>
    </div>
  );
}
