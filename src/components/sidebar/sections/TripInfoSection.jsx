import { useEffect, useState } from 'react';
import { CURRENCIES } from '../../../lib/constants';
import { fileToBase64, fileToCoverBase64 } from '../../../lib/utils';
import { db } from '../../../lib/db';
import { UploadCloud, MapPin } from 'lucide-react';
export default function TripInfoSection({ tripData, updateTripData, tripName, onNameChange }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(db.getCountries());
  }, []);

  const handleChange = (field, value) => {
    updateTripData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCountry = countries.find(c => c.name === tripData.country);
  const selectedCities = (tripData.cities || '').split(/[,\u060c]/).map(s => s.trim()).filter(Boolean);

  const handleCountryChange = (countryName) => {
    // Changing country resets the previously chosen cities (they belonged to the old country)
    updateTripData(prev => ({ ...prev, country: countryName, cities: '' }));
  };

  const toggleCity = (cityName) => {
    const next = selectedCities.includes(cityName)
      ? selectedCities.filter(c => c !== cityName)
      : [...selectedCities, cityName];
    handleChange('cities', next.join('، '));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToCoverBase64(file);
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
        <select
          value={tripData.country || ''}
          onChange={e => handleCountryChange(e.target.value)}
          style={inputStyle}
        >
          <option value="" style={{ color: '#000' }}>— اختر الدولة —</option>
          {countries.map(c => (
            <option key={c.id} value={c.name} style={{ color: '#000' }}>{c.name}</option>
          ))}
        </select>
        {countries.length === 0 && (
          <div style={{ fontSize: '11px', color: '#ffa500' }}>⚠️ لا توجد دول معرّفة — أضفها من الصفحة الرئيسية ← الدول والمدن.</div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--ne)', marginBottom: '6px' }}>المدن المزارة</label>
          {selectedCountry && selectedCountry.cities?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedCountry.cities.map(city => {
                const active = selectedCities.includes(city.name);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => toggleCity(city.name)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: active ? 'rgba(140,198,63,0.2)' : 'var(--bg-card)',
                      border: `1px solid ${active ? 'var(--g)' : 'var(--bg-card-border)'}`,
                      color: active ? 'var(--g)' : 'var(--text-muted)',
                      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                    }}
                  >
                    <MapPin size={11} /> {city.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)' }}>
              {tripData.country ? 'لا توجد مدن معرّفة لهذه الدولة بعد.' : 'اختر الدولة أولاً لعرض مدنها.'}
            </div>
          )}
        </div>
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
        <label style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px',
          background: tripData.isHoneymoon ? 'rgba(255,105,180,0.12)' : 'var(--bg-card)',
          border: `1px solid ${tripData.isHoneymoon ? '#ff69b4' : 'var(--bg-card-border)'}`,
          borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <input
            type="checkbox"
            checked={!!tripData.isHoneymoon}
            onChange={e => handleChange('isHoneymoon', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#ff69b4', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', fontWeight: '700', color: tripData.isHoneymoon ? '#ff69b4' : 'var(--text-main)' }}>
            💍 عروسين (رحلة عسل)
          </span>
        </label>

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
