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

        {/* Labeled fields */}
        {[
          { label: 'العاصمة', field: 'capital', placeholder: 'مثال: الرياض' },
          { label: 'المساحة', field: 'area', placeholder: 'مثال: 2.1 مليون كم²' },
          { label: 'عدد السكان', field: 'population', placeholder: 'مثال: 35 مليون' },
          { label: 'اللغة الرسمية', field: 'language', placeholder: 'مثال: العربية' },
          { label: 'العملة', field: 'currencyName', placeholder: 'مثال: الريال السعودي' },
          { label: 'نظام الحكم', field: 'government', placeholder: 'مثال: ملكي' },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ne)', marginBottom: '4px', letterSpacing: '0.5px' }}>
              {label}
            </label>
            <input 
              placeholder={placeholder}
              value={countryInfo[field] || ''} 
              onChange={e => handleChange(field, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ne)', marginBottom: '4px', letterSpacing: '0.5px' }}>
            المناخ
          </label>
          <textarea 
            placeholder="المناخ (ثلاث أسطر تقريبا)..." 
            value={countryInfo.climate} 
            onChange={e => handleChange('climate', e.target.value)}
            style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
          />
        </div>
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
