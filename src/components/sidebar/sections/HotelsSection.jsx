import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, MapPin, Star, UploadCloud } from 'lucide-react';
import { fileToBase64 } from '../../../lib/utils';

export default function HotelsSection({ tripData, updateTripData }) {
  const addCity = () => {
    updateTripData(prev => ({
      ...prev,
      hotels: [...(prev.hotels || []), { id: uuidv4(), city: '', list: [] }]
    }));
  };

  const updateCity = (id, newCity) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(c => c.id === id ? { ...c, city: newCity } : c)
    }));
  };

  const removeCity = (id) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.filter(c => c.id !== id)
    }));
  };

  const addHotel = (cityId) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(c => c.id === cityId ? {
        ...c, list: [...c.list, { id: uuidv4(), name: '', stars: 4, nights: 1, image: '', location: '' }]
      } : c)
    }));
  };

  const updateHotel = (cityId, hotelId, field, value) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(c => c.id === cityId ? {
        ...c, list: c.list.map(h => h.id === hotelId ? { ...h, [field]: value } : h)
      } : c)
    }));
  };

  const handleImageUpload = async (cityId, hotelId, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        updateHotel(cityId, hotelId, 'image', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const removeHotel = (cityId, hotelId) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(c => c.id === cityId ? {
        ...c, list: c.list.filter(h => h.id !== hotelId)
      } : c)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>الفنادق 🏨</h3>
        <button onClick={addCity} style={addBtnStyle}><Plus size={14} /> أضف مدينة</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tripData.hotels?.map(cityGroup => (
          <div key={cityGroup.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="var(--g)" />
              <input 
                placeholder="اسم المدينة" 
                value={cityGroup.city} 
                onChange={e => updateCity(cityGroup.id, e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={() => removeCity(cityGroup.id)} style={delBtnStyle}><Trash2 size={14} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '12px', borderRight: '2px solid var(--bg-card-border)' }}>
              {cityGroup.list.map(hotel => (
                <div key={hotel.id} style={{ background: 'var(--bg-card-dark)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                    <input 
                      placeholder="اسم الفندق" 
                      value={hotel.name} 
                      onChange={e => updateHotel(cityGroup.id, hotel.id, 'name', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={() => removeHotel(cityGroup.id, hotel.id)} style={delBtnStyle}><Trash2 size={14} /></button>
                  </div>
                  
                  <input 
                    placeholder="رابط الموقع (Google Maps)" 
                    value={hotel.location || ''} 
                    onChange={e => updateHotel(cityGroup.id, hotel.id, 'location', e.target.value)}
                    style={{ ...inputStyle, marginBottom: '8px', direction: 'ltr' }}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--bg-card-border)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>الليالي:</span>
                      <input 
                        type="number"
                        value={hotel.nights} 
                        onChange={e => updateHotel(cityGroup.id, hotel.id, 'nights', parseInt(e.target.value) || 0)}
                        style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'center', width: '100%', background: 'transparent' }}
                        min={1}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--bg-card-border)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>نجوم:</span>
                      <input 
                        type="number"
                        value={hotel.stars} 
                        onChange={e => updateHotel(cityGroup.id, hotel.id, 'stars', parseInt(e.target.value) || 0)}
                        style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'center', width: '100%', background: 'transparent' }}
                        min={1} max={7}
                      />
                    </div>
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--bg-card-border)', padding: '6px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.2)', cursor: 'pointer', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <UploadCloud size={14} /> {hotel.image ? 'تم إرفاق صورة الفندق' : 'إضافة صورة الفندق'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(cityGroup.id, hotel.id, e)} />
                  </label>
                  {hotel.image && (
                    <img src={hotel.image} alt="Hotel Preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '6px' }} />
                  )}
                </div>
              ))}
              <button onClick={() => addHotel(cityGroup.id)} style={{ ...addBtnStyle, width: 'fit-content' }}>
                <Plus size={14} /> أضف فندق
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)',
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
