import { Plus, Check, X } from 'lucide-react';

export default function IncludesSection({ tripData, updateTripData }) {
  const addInclude = (included) => {
    updateTripData(prev => ({
      ...prev,
      includes: [...(prev.includes || []), { text: '', included }]
    }));
  };

  const updateInclude = (index, field, value) => {
    updateTripData(prev => {
      const newIncludes = [...prev.includes];
      newIncludes[index] = { ...newIncludes[index], [field]: value };
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
          <div key={i} style={{
            display: 'flex', gap: '8px', alignItems: 'center',
            background: item.included ? 'rgba(140,198,63,0.05)' : 'rgba(255,70,70,0.04)',
            padding: '8px', borderRadius: '8px',
            border: `1px solid ${item.included ? 'rgba(140,198,63,0.2)' : 'rgba(255,70,70,0.2)'}`
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: item.included ? 'rgba(140,198,63,0.15)' : 'rgba(255,70,70,0.15)',
              color: item.included ? 'var(--g)' : '#ff6b6b'
            }}>
              {item.included ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            </span>
            <input 
              value={item.text}
              onChange={(e) => updateInclude(i, 'text', e.target.value)}
              placeholder={item.included ? 'وصف البند المشمول...' : 'وصف البند غير المشمول...'}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px' }}
            />
            <button onClick={() => removeInclude(i)} style={{ color: '#ff4444', padding: '4px' }}>
              <X size={16} />
            </button>
          </div>
        ))}
        
        {/* Dual Add Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={() => addInclude(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px', background: 'rgba(140,198,63,0.12)',
              border: '1px dashed rgba(140,198,63,0.5)', color: 'var(--g)',
              borderRadius: '8px', fontSize: '13px', fontWeight: '700'
            }}
          >
            <Check size={15} strokeWidth={3} /> يشمل
          </button>
          <button
            onClick={() => addInclude(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px', background: 'rgba(255,70,70,0.08)',
              border: '1px dashed rgba(255,70,70,0.4)', color: '#ff6b6b',
              borderRadius: '8px', fontSize: '13px', fontWeight: '700'
            }}
          >
            <X size={15} strokeWidth={3} /> لا يشمل
          </button>
        </div>
      </div>
    </div>
  );
}
