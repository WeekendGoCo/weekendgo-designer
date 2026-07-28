export default function CountryInfoSection({ tripData, updateTripData }) {
  const handleChange = (field, value) => {
    updateTripData(prev => ({
      ...prev,
      countryInfo: { ...prev.countryInfo, [field]: value }
    }));
  };

  const { countryInfo } = tripData;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--ne)' }}>
        معلومات عن {tripData.country || 'الدولة'}
      </h3>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        <textarea 
          placeholder="نص تعريفي بالبلد (4-6 أسطر)..." 
          value={countryInfo.description} 
          onChange={e => handleChange('description', e.target.value)}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />
        <input 
          placeholder="العاصمة" 
          value={countryInfo.capital} 
          onChange={e => handleChange('capital', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="المساحة" 
          value={countryInfo.area} 
          onChange={e => handleChange('area', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="عدد السكان" 
          value={countryInfo.population} 
          onChange={e => handleChange('population', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="اللغة الرسمية" 
          value={countryInfo.language} 
          onChange={e => handleChange('language', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="العملة" 
          value={countryInfo.currencyName} 
          onChange={e => handleChange('currencyName', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="نظام الحكم" 
          value={countryInfo.government} 
          onChange={e => handleChange('government', e.target.value)}
          style={inputStyle}
        />
        <textarea 
          placeholder="المناخ (ثلاث أسطر تقريبا)..." 
          value={countryInfo.climate} 
          onChange={e => handleChange('climate', e.target.value)}
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--bg-card-border)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: 'var(--text-main)',
  fontSize: '13px',
  outline: 'none',
  width: '100%'
};
