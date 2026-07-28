import { CURRENCIES } from '../../../lib/constants';
import { fileToBase64 } from '../../../lib/utils';
import { UploadCloud } from 'lucide-react';
export default function TripInfoSection({ tripData, updateTripData, tripName, onNameChange }) {
  const handleChange = (field, value) => {
    updateTripData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        handleChange('coverImage', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--ne)' }}>المعلومات الأساسية</h3>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        <input 
          placeholder="اسم الرحلة (يستخدم للحفظ)" 
          value={tripName || ''} 
          onChange={e => onNameChange && onNameChange(e.target.value)}
          style={{ ...inputStyle, borderColor: 'var(--c)' }}
        />
        <input 
          placeholder="الشارة (مثال: ✓ تأكيد فوري)" 
          value={tripData.badge} 
          onChange={e => handleChange('badge', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="الدولة" 
          value={tripData.country} 
          onChange={e => handleChange('country', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="المدن (مفصولة بفاصلة أو نقطة)" 
          value={tripData.cities} 
          onChange={e => handleChange('cities', e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input 
            type="number" 
            placeholder="الأيام" 
            value={tripData.days} 
            onChange={e => handleChange('days', parseInt(e.target.value) || 0)}
            style={inputStyle}
            min={1} max={14}
          />
          <input 
            type="number" 
            placeholder="الليالي" 
            value={tripData.nights} 
            onChange={e => handleChange('nights', parseInt(e.target.value) || 0)}
            style={inputStyle}
            min={1} max={14}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={tripData.currency}
            onChange={e => handleChange('currency', e.target.value)}
            style={{ ...inputStyle, width: '100px' }}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code} style={{ color: '#000' }}>{c.label}</option>
            ))}
          </select>
          <input 
            placeholder="السعر الحالي" 
            value={tripData.price} 
            onChange={e => handleChange('price', e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
        <input 
          placeholder="السعر قبل الخصم (اختياري)" 
          value={tripData.priceBefore} 
          onChange={e => handleChange('priceBefore', e.target.value)}
          style={inputStyle}
        />
        
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c)', marginTop: '8px' }}>تخصيص العميل</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <select
              value={tripData.clientTitle || 'السيد'}
              onChange={e => handleChange('clientTitle', e.target.value)}
              style={{ ...inputStyle, width: 'auto', padding: '8px 4px', fontSize: '11px' }}
            >
              <option value="السيد">السيد</option>
              <option value="السيدة">السيدة</option>
              <option value="الآنسة">الآنسة</option>
              <option value="عائلة">عائلة</option>
            </select>
            <input 
              placeholder="اسم العميل" 
              value={tripData.clientName || ''} 
              onChange={e => handleChange('clientName', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <input 
            type="date"
            placeholder="تاريخ العرض" 
            value={tripData.offerDate || ''} 
            onChange={e => handleChange('offerDate', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>تاريخ السفر (من):</span>
            <input 
              type="date"
              value={tripData.tripStartDate || ''} 
              onChange={e => handleChange('tripStartDate', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>تاريخ السفر (إلى):</span>
            <input 
              type="date"
              value={tripData.tripEndDate || ''} 
              onChange={e => handleChange('tripEndDate', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
          <input 
            type="number" 
            placeholder="عدد البالغين" 
            value={tripData.paxAdults} 
            onChange={e => handleChange('paxAdults', parseInt(e.target.value) || 0)}
            style={inputStyle}
            min={1}
          />
          <input 
            type="number" 
            placeholder="عدد الأطفال" 
            value={tripData.paxChildren} 
            onChange={e => handleChange('paxChildren', parseInt(e.target.value) || 0)}
            style={inputStyle}
            min={0}
          />
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c)', marginTop: '8px' }}>معلومات التواصل</h4>
        <input 
          placeholder="رقم الهاتف (للتواصل في الفوتر)" 
          value={tripData.clientPhone} 
          onChange={e => handleChange('clientPhone', e.target.value)}
          style={inputStyle}
        />
        <input 
          placeholder="رابط الواتساب (مثال: https://wa.me/966...)" 
          value={tripData.wa} 
          onChange={e => handleChange('wa', e.target.value)}
          style={inputStyle}
          dir="ltr"
        />
        <input 
          placeholder="البريد الإلكتروني" 
          value={tripData.email} 
          onChange={e => handleChange('email', e.target.value)}
          style={inputStyle}
          dir="ltr"
        />
        <input 
          placeholder="الموقع الإلكتروني" 
          value={tripData.web} 
          onChange={e => handleChange('web', e.target.value)}
          style={inputStyle}
          dir="ltr"
        />

        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c)', marginTop: '8px' }}>صورة الغلاف</h4>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '16px', background: 'var(--bg-card-border)', border: '1px dashed rgba(255,255,255,0.2)',
          borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <UploadCloud size={24} style={{ marginBottom: '8px', color: 'var(--ne)' }} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>اضغط لرفع صورة الغلاف</span>
          <span style={{ fontSize: '10px', color: 'var(--c)', marginTop: '4px', direction: 'ltr' }}>Recommended: 1080x1920</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </label>
        {tripData.coverImage && (
          <img src={tripData.coverImage} alt="Cover Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />
        )}
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
